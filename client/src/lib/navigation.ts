export function navigateTo(href: string) {
  const nextUrl = new URL(href, window.location.href);
  if (nextUrl.origin !== window.location.origin) {
    window.location.assign(nextUrl.href);
    return;
  }

  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const next = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
  if (current === next) return;

  window.history.pushState({}, "", next);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ left: 0, top: 0 });
}
