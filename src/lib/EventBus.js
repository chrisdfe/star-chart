class EventBus {
  constructor() {
    this.events = {};
  }

  on = (eventName, callback) => {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);
  };

  off = (eventName, callback) => {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(
      handler => handler !== callback
    );
  };

  trigger = (eventName, ...payload) => {
    if (this.events[eventName]) {
      this.events[eventName].forEach(handler => handler(...payload));
    }
  };
}

export default new EventBus();
