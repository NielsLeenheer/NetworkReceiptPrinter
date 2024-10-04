# NetworkReceiptPrinter

This is an library that allows you to print to a network receipt printer using Node network sockets.

<br>

[![npm](https://img.shields.io/npm/v/@point-of-sale/network-receipt-printer)](https://www.npmjs.com/@point-of-sale/network-receipt-printer)
![GitHub License](https://img.shields.io/github/license/NielsLeenheer/NetworkReceiptPrinter)


> This library is part of [@point-of-sale](https://point-of-sale.dev), a collection of libraries for interfacing browsers and Node with Point of Sale devices such as receipt printers, barcode scanners and customer facing displays.

<br>

## What does this library do?

In order to print a receipt on a receipt printer you need to build the receipt and encode it as in the ESC/POS or StarPRNT language. You can use the [`ReceiptPrinterEncoder`](https://github.com/NielsLeenheer/ReceiptPrinterEncoder) library for this. You end up with an array of raw bytes that needs to be send to the printer. One way to do that is using a network connection.

<br>

## Installation

If you want to use this libary, first install the package using npm:

```
npm install @point-of-sale/network-receipt-printer --save
```

In your project you can then import it, if you use ES6 modules:

```js
import NetworkReceiptPrinter from '@point-of-sale/network-receipt-printer';

let receiptPrinter = new NetworkReceiptPrinter();
```

Or require it, if you are using CommonJS:

```js
let NetworkReceiptPrinter = require('@point-of-sale/network-receipt-printer');

let receiptPrinter = new NetworkReceiptPrinter();
```

<br>

## Configuration

When you create the `NetworkReceiptPrinter` object you can specify a number of options to help with the library with connecting to the device. 

### Network settings

When a network printer is connected to the network it will get assigned a IP address. Consult the manual of your printer for a method to get the network settings of your printer. Once you have the IP address of your printer, provide them as properties when you instantiate the `NetworkReceiptPrinter` object:

- `host`: The IP address of the printer.
- `port`: The port number of the printer, by default this is `9100`.

For example, to connect to `192.168.1.133` using the default port:

```js
const receiptPrinter = new NetworkReceiptPrinter({ 
    host:   '192.168.1.133'
});
```

<br>

## Connect to a receipt printer

The actually connect to the printer you need to call the `connect()` function. To find out when a receipt printer is connected you can listen for the `connected` event using the `addEventListener()` function.

```js
receiptPrinter.addEventListener('connected', device => {
    console.log(`Connected to printer`);
});
```

The callback of the `connected` event is passed an object with the following properties:

-   `type`<br>
    Type of the connection that is used, in this case it is always `network`.

<br>

## Commands

Once connected you can use the following command to print receipts.

### Printing receipts

When you want to print a receipt, you can call the `print()` function with an array, or a typed array with bytes. The data must be properly encoded for the printer. 

For example:

```js
/* Encode the receipt */

let encoder = new ReceiptPrinterEncoder({
    language:  'esc-pos',
    codepageMapping: 'epson'
});

let data = encoder
    .initialize()
    .text('The quick brown fox jumps over the lazy dog')
    .newline()
    .qrcode('https://nielsleenheer.com')
    .encode();

/* Print the receipt */

receiptPrinter.print(data);
```

### Disconnect from the printer 

When you are done with printing, you can call the `disconnect()` function. This will terminate the connection to the printer. If the connection to the printer is closed, the library will emit a `disconnected` event.

```js
receiptPrinter.addEventListener('disconnected', () => {
    console.log(`Disconnected from the printer`);
});

receiptPrinter.disconnect();
```

<br>

-----

<br>

This library has been created by Niels Leenheer under the [MIT license](LICENSE). Feel free to use it in your products. The  development of this library is sponsored by Salonhub.

<a href="https://salohub.nl"><img src="https://salonhub.nl/assets/images/salonhub.svg" width=140></a>
