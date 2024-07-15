import net from 'node:net';
import EventEmitter from "./event-emitter.js";

class ReceiptPrinter {}

class NetworkReceiptPrinter extends ReceiptPrinter {

	constructor(options) {
		super();

        this._internal = {
            emitter:    new EventEmitter(),
			client:		new net.Socket(),
			host:		options.host || 'localhost',
			port:		options.port || 9100
        }
	}

	async connect() {
		this._internal.client.connect(this._internal.port, this._internal.host, () => {
			this._internal.emitter.emit('connected', {
				type:				'network'
			});
		});

		this._internal.client.on('close', () => {
			this._internal.emitter.emit('disconnected');
		});
	}

	async listen() {
		this._internal.client.on('data', data => {
			this._internal.emitter.emit('data', data);
		});
	}

	async disconnect() {
		this._internal.client.destroy();
		this._internal.emitter.emit('disconnected');
	}
	
	async print(command) {
		this._internal.client.write(command);
	}

	addEventListener(n, f) {
		this._internal.emitter.on(n, f);
	}
}

export default NetworkReceiptPrinter;