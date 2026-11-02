// Notifications contain no account or question data. Receivers always reread
// through their own authenticated request, including after an account switch.
const eventName = 'generator-planner:changed';
const channelName = 'generator-planner';

export function notifyPlannerChanged() {
  window.dispatchEvent(new Event(eventName));
  if (typeof BroadcastChannel === 'undefined') return;
  try {
    const channel = new BroadcastChannel(channelName);
    try { channel.postMessage('changed'); } finally { channel.close(); }
  } catch { /* Focus/visibility refresh still works when channels are blocked. */ }
}

export function subscribePlannerChanges(refresh: () => void) {
  const visibleRefresh = () => { if (document.visibilityState !== 'hidden') refresh(); };
  let channel: BroadcastChannel | undefined;
  try { if (typeof BroadcastChannel !== 'undefined') channel = new BroadcastChannel(channelName); } catch { /* Use focus and polling. */ }
  channel?.addEventListener('message', visibleRefresh);
  window.addEventListener(eventName, visibleRefresh);
  window.addEventListener('focus', visibleRefresh);
  document.addEventListener('visibilitychange', visibleRefresh);
  // Also covers another browser/device and reconnecting after a missed event.
  const interval = window.setInterval(visibleRefresh, 15000);
  return () => {
    channel?.close();
    window.removeEventListener(eventName, visibleRefresh);
    window.removeEventListener('focus', visibleRefresh);
    document.removeEventListener('visibilitychange', visibleRefresh);
    window.clearInterval(interval);
  };
}
