// Private broadcast test double. Distinct channels exchange server messages.
const channels = new Set();
exports.channel = function channel(name) {
  const listeners = [];
  const value = {
    name,
    on(_type, filter, callback) { listeners.push({ event: filter.event, callback }); return this; },
    subscribe(callback) { channels.add(value); queueMicrotask(() => callback('SUBSCRIBED')); return this; },
    async send(message) {
      for (const other of channels) if (other !== value && other.name === name) other.receive(message);
      return 'ok';
    },
    receive(message) { for (const listener of listeners) if (listener.event === message.event) listener.callback({ payload: structuredClone(message.payload) }); },
  };
  return value;
};
exports.removeChannel = async channel => { channels.delete(channel); return 'ok'; };
