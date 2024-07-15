import NetworkReceiptPrinter from "../src/main.js";
import ThermalPrinterStatus from "../../ThermalPrinterStatus/dist/thermal-printer-status.esm.js";


const printer = new NetworkReceiptPrinter({
    host: '192.168.1.41',
    port: 9100
});

printer.addEventListener('connected', async () => {
    console.log('Connected to printer');

    let printerStatus = new ThermalPrinterStatus({
        language: 'esc-pos',
        printer
    });

    printerStatus.addEventListener('connected', () => {
        let status = printerStatus.status;

        console.log('Current status: ', status);

        printerStatus.addEventListener('update', status => {                
            console.log('Status update: ', status);
        });
    });

    printerStatus.cashDrawer.addEventListener('open', () => {
        console.log('Cash drawer opened');
    });

    printerStatus.cashDrawer.addEventListener('close', () => {
        console.log('Cash drawer closed');
    });

    printerStatus.addEventListener('unsupported', () => {
        console.log('Status updates are not supported by this printer.');
    });

    setTimeout(() => {
        printerStatus.cashDrawer.open();
    }, 10000);
});

printer.addEventListener('disconnected', () => {
    console.log('Disconnected from printer');
});

printer.connect();
