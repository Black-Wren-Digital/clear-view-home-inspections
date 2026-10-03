// Opens and closes the mobile nav panel named by the button's aria-controls.
export function initMenu(root = document) {
  const button = root.querySelector('[data-menu-button]');
  const panel = button && root.querySelector(`#${button.getAttribute('aria-controls')}`);
  if (!button || !panel) return () => {};

  const controller = new AbortController();
  const { signal } = controller;

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };

  button.addEventListener('click', () => setOpen(!isOpen()), { signal });

  panel.addEventListener(
    'click',
    (event) => {
      if (event.target.closest('a')) setOpen(false);
    },
    { signal },
  );

  root.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        button.focus();
      }
    },
    { signal },
  );

  return () => controller.abort();
}
