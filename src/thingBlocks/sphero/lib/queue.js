/* The objective of this queue is to send packets in turns to avoid GATT error */

export default class Queue{
	constructor(write){
		this.running = false;
		this.tasks = [];
        this.write = write
	}

	runCommand(data){
		this.running = true;
		this.write(data, _ => {
			this.running = false;
			if (this.tasks.length > 0)
			{
				this.runCommand(this.tasks.shift());
			}
		})
	}

	enqueueCommand(data){
		this.tasks.push(data);
	}

	queue (data){
		!this.running ? this.runCommand(data) : this.enqueueCommand(data);
	}
}
