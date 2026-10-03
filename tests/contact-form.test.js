import { describe, it, expect, vi } from "vitest";
import {
  buildMailto,
  submitContactForm,
  initContactForm,
  MESSAGES,
} from "../src/js/contact-form.js";

function renderForm({ endpoint = "" } = {}) {
  document.body.innerHTML = `
    <div>
      <form id="contact-form" data-endpoint="${endpoint}">
        <input type="hidden" name="form-name" value="contact">
        <input type="text" name="_gotcha">
        <input name="first_name" value="Jane">
        <input name="last_name" value="Doe">
        <input name="email" value="jane@example.com">
        <textarea name="message">Hello</textarea>
        <button type="submit">Send message</button>
        <p role="status"></p>
      </form>
      <div data-form-success hidden tabindex="-1">Thanks!</div>
    </div>`;
  return document.getElementById("contact-form");
}

const status = () => document.querySelector('[role="status"]');
const success = () => document.querySelector("[data-form-success]");
const button = () => document.querySelector('button[type="submit"]');

function deferred() {
  let resolve;
  const promise = new Promise((r) => (resolve = r));
  return { promise, resolve };
}

describe("buildMailto", () => {
  it("builds the mailto URL with the subject and the body", () => {
    expect(
      buildMailto({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        message: "Hello",
      }),
    ).toBe(
      "mailto:info@cvhi.us?subject=Schedule%20Home%20Inspection&body=Name%3A%20Jane%20Doe%0D%0AEmail%3A%20jane%40example.com%0D%0A%0D%0AHello",
    );
  });

  it("encodes characters that would break the mailto URL", () => {
    const message = "Radon & mold?\nLot #12, 50% done";
    const url = buildMailto({
      firstName: "A",
      lastName: "B",
      email: "a@b.co",
      message,
    });
    expect(url.split("&")).toHaveLength(2);
    expect(url).not.toContain("#");
    const body = decodeURIComponent(url.split("&body=")[1]);
    expect(body.endsWith("Radon & mold?\nLot #12, 50% done")).toBe(true);
  });
});

describe("submitContactForm without an endpoint", () => {
  it("opens the email app with the form text and does not call fetch", async () => {
    const form = renderForm();
    const fetchImpl = vi.fn();
    const openUrl = vi.fn();
    await submitContactForm(form, { fetchImpl, openUrl });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(openUrl).toHaveBeenCalledOnce();
    expect(openUrl).toHaveBeenCalledWith(
      buildMailto({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        message: "Hello",
      }),
    );
    expect(status().textContent).toBe(MESSAGES.mailto);
  });
});

describe("submitContactForm with an endpoint", () => {
  it("posts the form as URL-encoded data and shows the success message", async () => {
    const form = renderForm({ endpoint: "https://formspree.io/f/test" });
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    await submitContactForm(form, { fetchImpl, openUrl: vi.fn() });

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, options] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://formspree.io/f/test");
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    });
    const body = new URLSearchParams(options.body);
    expect(body.get("form-name")).toBe("contact");
    expect(body.get("first_name")).toBe("Jane");
    expect(body.get("email")).toBe("jane@example.com");
    expect(body.get("message")).toBe("Hello");

    expect(form.hidden).toBe(true);
    expect(success().hidden).toBe(false);
    expect(document.activeElement).toBe(success());
  });

  it("disables the button while the request is in progress", async () => {
    const form = renderForm({ endpoint: "/" });
    const request = deferred();
    const pending = submitContactForm(form, {
      fetchImpl: () => request.promise,
      openUrl: vi.fn(),
    });
    expect(button().disabled).toBe(true);
    expect(status().textContent).toBe(MESSAGES.sending);
    request.resolve({ ok: true, status: 200 });
    await pending;
  });

  it("ignores a second submit while the first request is in progress", async () => {
    const form = renderForm({ endpoint: "/" });
    const request = deferred();
    const fetchImpl = vi.fn(() => request.promise);
    const first = submitContactForm(form, { fetchImpl, openUrl: vi.fn() });
    const second = submitContactForm(form, { fetchImpl, openUrl: vi.fn() });
    request.resolve({ ok: true, status: 200 });
    await Promise.all([first, second]);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("keeps the text and re-enables the button when the response is not OK", async () => {
    const form = renderForm({ endpoint: "/" });
    await submitContactForm(form, {
      fetchImpl: vi.fn().mockResolvedValue({ ok: false, status: 422 }),
      openUrl: vi.fn(),
    });
    expect(status().textContent).toBe(MESSAGES.error);
    expect(status().dataset.state).toBe("error");
    expect(form.hidden).toBe(false);
    expect(success().hidden).toBe(true);
    expect(form.elements.namedItem("message").value).toBe("Hello");
    expect(button().disabled).toBe(false);
  });

  it("keeps the text and re-enables the button when the network fails", async () => {
    const form = renderForm({ endpoint: "/" });
    await submitContactForm(form, {
      fetchImpl: vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
      openUrl: vi.fn(),
    });
    expect(status().textContent).toBe(MESSAGES.error);
    expect(form.elements.namedItem("first_name").value).toBe("Jane");
    expect(button().disabled).toBe(false);
  });

  it("can send again after a failure", async () => {
    const form = renderForm({ endpoint: "/" });
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce({ ok: true, status: 200 });
    await submitContactForm(form, { fetchImpl, openUrl: vi.fn() });
    await submitContactForm(form, { fetchImpl, openUrl: vi.fn() });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(success().hidden).toBe(false);
  });
});

describe("spam protection", () => {
  it("sends nothing when the hidden field has a value", async () => {
    const form = renderForm({ endpoint: "/" });
    form.elements.namedItem("_gotcha").value = "spam";
    const fetchImpl = vi.fn();
    const openUrl = vi.fn();
    await submitContactForm(form, { fetchImpl, openUrl });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(openUrl).not.toHaveBeenCalled();
  });
});

describe("initContactForm", () => {
  it("stops the normal form post and handles the submit", async () => {
    const form = renderForm();
    const openUrl = vi.fn();
    initContactForm(form, { fetchImpl: vi.fn(), openUrl });
    const event = new Event("submit", { cancelable: true });
    form.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    await vi.waitFor(() => expect(openUrl).toHaveBeenCalledOnce());
  });
});
