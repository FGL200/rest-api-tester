import { Component } from '@angular/core';
import { LocalStorageService } from './local-stoage/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private lstorage: LocalStorageService
  ) {
    const parameteValues = (lstorage.array.get('parameters') as ParameterItemInterface[]);
    const payloadValues = (lstorage.array.get('payloads') as ParameterItemInterface[]);
    if (parameteValues.length) {
      this.parameter.values = [];
      parameteValues.forEach(v => this.parameter.add(v.key, v.value));
    }
    if (payloadValues.length) {
      this.payload.values = [];
      payloadValues.forEach(v => this.payload.add(v.key, v.value));
    }
  }

  public APIURL: APIURLInterface = {
    method: this.lstorage.string.get('method') ?? 'GET',
    protocol: this.lstorage.string.get('protocol') ?? 'http://',
    host: this.lstorage.string.get('host') ?? 'localhost',
    port: this.lstorage.string.get('port') ?? '5000',
    path: this.lstorage.string.get('path') ?? '',
    url: this.lstorage.string.get('url') ?? '',
    result: this.lstorage.string.get('result') ?? '',
    status: "black",
    send: async () => {
      const { url, method, protocol, host, port, path } = this.APIURL;
      this.lstorage.string.set('method', method);
      this.lstorage.string.set('protocol', protocol);
      this.lstorage.string.set('host', host);
      this.lstorage.string.set('port', port);
      this.lstorage.string.set('path', path);
      this.lstorage.string.set('url', url);

      this.lstorage.array.set('parameters', this.parameter.values);
      this.lstorage.array.set('payloads', this.payload.values);

      const bodyPayload: ParameterItemInterface[] = [];
      this.payload.values.
        filter(v => v.value && v.key)
        .forEach(v => bodyPayload.push(v));
      const body = bodyPayload.length ? JSON.stringify(this.payloadToObject(bodyPayload)) : undefined;

      this.APIURL.result = "Waiting...";
      this.APIURL.status = "warning";
      fetch(this.APIURL.url, {
        method,
        body,
      })
        .then(v => v.json())
        .then(v => {
          this.APIURL.result = JSON.stringify(v, null, 2);
          this.APIURL.status = "success";
        })
        .catch(err => {
          console.log({ err })
          this.APIURL.result = `ERROR: ${err.message} | ${err.stack}`;
          this.APIURL.status = "danger";
        })
    },
  }

  public parameter: ParameterInterface = {
    values: [
      { key: '', value: '' }
    ],
    add: (key?: string, value?: string) => {
      this.parameter.values.push({ key: key ?? '', value: value ?? '' });
    },
    delete: (index: number) => {
      if (confirm("Are you sure youwan to delete this item?")) this.parameter.values.splice(index, 1);
      if (!this.parameter.values.length) this.parameter.add();
    }
  }

  public payload: PayloadInterface = {
    values: [
      { key: '', value: '' }
    ],
    add: (key?: string, value?: string) => {
      this.payload.values.push({ key: key ?? '', value: value ?? '' });
    },
    delete: (index: number) => {
      if (confirm("Are you sure youwan to delete this item?")) this.payload.values.splice(index, 1);
      if (!this.payload.values.length) this.payload.add();
    }
  }

  public onChangeValues(e?: Event) {
    this.generateURL();
  }

  private generateURL() {
    const { protocol, host, port, path } = this.APIURL;

    let params = '';
    this.parameter.values
      .filter(v => v.value && v.key)
      .map((v, i) => `${v.key}=${v.value}` + ((i + 1) != this.parameter.values.length ? '&' : ''))
      .forEach(v => params += v);
    this.APIURL.url = `${protocol}${host}${port ? ':' + port : ''}${path}${params ? '?' + params : ''}`;
  }

  private payloadToObject(values: PayloadItemInterface[]): Object {
    return values.reduce((cv, nv) => ({ ...cv, [nv.key]: JSON.parse(nv.value) }), {});;
  }

}

interface ParameterInterface {
  values: ParameterItemInterface[],
  add: (key?: string, value?: string) => void,
  delete: (index: number) => void,
}

interface ParameterItemInterface {
  key: string,
  value: string
}

interface PayloadInterface {
  values: PayloadItemInterface[],
  add: (key?: string, value?: string) => void,
  delete: (index: number) => void,
}

interface PayloadItemInterface {
  key: string,
  value: string
}

interface APIURLInterface {
  method: string,
  protocol: string,
  host: string,
  port: string,
  path: string,
  send: () => Promise<void>,
  result: string,
  url: string,
  status: string,
}