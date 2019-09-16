export default class Ambience {
  start() {}

  togglePause(paused) {
    (paused ? this.pause : this.unpause)();
  }

  pause() {}
  unpause() {}
}
