import NetworkReceiptPrinter from "../src/main.js";
import ThermalPrinterEncoder from "../../ThermalPrinterEncoder/dist/thermal-printer-encoder.mjs";


const printer = new NetworkReceiptPrinter({
    host: '192.168.1.41',
    port: 9100
});

const encoder = new ThermalPrinterEncoder({
    language: 'esc-pos',
});

printer.addEventListener('connected', async () => {
    console.log('Connected to printer');

    const commands = encoder
        .initialize()
        .text('Hello, world!')
        .newline()
        .newline()
        .cut()
        .encode();

    await printer.print(commands);
    await printer.disconnect();
});

printer.addEventListener('disconnected', () => {
    console.log('Disconnected from printer');
});

printer.connect();
