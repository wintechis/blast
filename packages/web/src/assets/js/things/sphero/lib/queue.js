/* The objective of this queue is to send packets in turns to avoid GATT error */

export default class Queue {
  constructor(write) {
    this.running = false;
    this.tasks = [];
    this.write = write;
  }

  runCommand(data) {
    this.running = true;
    this.write(data).then(() => {
      if (this.tasks.length > 0) {
        this.runCommand(this.tasks.shift());
      } else {
        this.running = false;
      }
    });
  }

  enqueueCommand(data) {
    // empty queue and add new command
    this.clear();
    this.tasks.push(data);
  }

  clear() {
    this.tasks.length = 0;
  }

  queue(data) {
    !this.running ? this.runCommand(data) : this.enqueueCommand(data);
  }
}
