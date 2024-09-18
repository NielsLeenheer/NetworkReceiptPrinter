import net from 'node:net';

class EventEmitter {
    constructor(device) {
        this._events = {};
    }

    on(e, f) {
        this._events[e] = this._events[e] || [];
        this._events[e].push(f);
    }

    emit(e, ...args) {
        let fs = this._events[e];
        if (fs) {
            fs.forEach(f => {
                setTimeout(() => f(...args), 0);
            });
        }
    }        
}

class ReceiptPrinterDriver {}

class NetworkReceiptPrinter extends ReceiptPrinterDriver {

	#emitter;
	#client;
	
	#options = {};

	constructor(options) {
		super();

		this.#emitter = new EventEmitter();
		this.#client = new net.Socket();

        this.#options = {
			host:		options.host || 'localhost',
			port:		options.port || 9100
        };
	}

	async connect() {
		this.#client.connect(this.#options.port, this.#options.host, () => {
			this.#emitter.emit('connected', {
				type: 'network'
			});
		});

		this.#client.on('close', () => {
			this.#emitter.emit('disconnected');
		});
	}

	async listen() {
		this.#client.on('data', data => {
			this.#emitter.emit('data', data);
		});

		return true;
	}

	async disconnect() {
		this.#client.destroy();
		this.#emitter.emit('disconnected');
	}
	
	async print(command) {
		this.#client.write(command);
	}

	addEventListener(n, f) {
		this.#emitter.on(n, f);
	}
}

export { NetworkReceiptPrinter as default };
