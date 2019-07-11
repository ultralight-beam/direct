export interface Device {
  device: any; // Todo create a type
  opts: any; // TODO create a type
  request(): void;
  connect(): void;
  disconnect(): void;
  onDisconnected(): void
}

export class Device implements Device {
  public device: any = null;
  public opts: any;
  constructor(opts: any) {
    this.opts = opts;
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  async request() {
    let options = {
      "filters": [{
        "name": this.opts.name
      }],
      "optionalServices": this.opts.services
    };
    // @ts-ignore
    this.device = await navigator.bluetooth.requestDevice(options);
    if (!this.device) {
      throw "No device selected";
    }
    this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
  }

  async connect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    }
    await this.device.gatt.connect();
  }

  disconnect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    }
    return this.device.gatt.disconnect();
  }

  onDisconnected() {
    console.log('Device is disconnected.');
  }
}
//
// var genericDevice = new GenericDevice();
//
// document.querySelector('button').addEventListener('click', async event => {
//   try {
//     await genericDevice.request();
//     await genericDevice.connect();
//     /* Do something with genericDevice... */
//   } catch(error) {
//     console.log(error);
//   }
// });
