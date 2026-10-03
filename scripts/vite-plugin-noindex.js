// Adds <meta name="robots" content="noindex"> to the page when enabled.
// The GitHub Pages preview build turns it on with SITE_NOINDEX=true, so search
// engines skip the preview. The launch build leaves the variable unset.
export function noindexPlugin(enabled) {
  return {
    name: "cvhi-noindex",
    transformIndexHtml() {
      if (!enabled) return [];
      return [
        {
          tag: "meta",
          attrs: { name: "robots", content: "noindex" },
          injectTo: "head",
        },
      ];
    },
  };
}
