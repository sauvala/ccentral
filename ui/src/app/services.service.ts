import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

export class Config {
  type: string;
  default: string;
  description: string;
  title: string;
  key: string;
  value: string;
  origValue: string;

  public static fromData(key: string, o: any): Config {
    console.log(o);
    return new Config(key, o.title, o.description, o.type, o.default);
  }

  constructor(key: string, title: string, description: string, type: string, dValue: string) {
    this.title = title;
    this.description = description;
    this.type = type;
    this.default = dValue;
    this.key = key;
    this.value = '';
    this.origValue = '';
  }
}

export class Metric {
  public _key: string;
  public _value: any;

  public title(): string {
    return this._key[0].toUpperCase() + this._key.substring(1);
  }

  public value(): string {
    return this._value;
  }

  public static fromData(key: string, value: any) {
    if (key === 'started') {
      return new TimeDelta(key, value);
    }
    return new Metric(key, value);
  }

  constructor(key: string, value: any) {
    this._key = key;
    this._value = value;
  }
}

export class TimeDelta extends Metric {
  
  public value() : string {
    let v = ((new Date).getTime()/1000 - parseInt(this._value))/60;
    if (v < 1) {
        return "Just now";
    } else if (v > 60*24) {
        return "" + Math.round(v/(60*24)) + " days";
    }
    return "" + Math.round(v) + " min";
  }
}

export class Instance {
  id: string;
  metrics: Metric[];

  public static fromData(id: string, data: Map<string, any>): Instance {
    let instance = new Instance(id);
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var element = data[key];
        instance.metrics.push(Metric.fromData(key, element));
      }
    }
    return instance;
  }

  constructor(id: string) {
    this.id = id;
    this.metrics = [];
  }
}

export class Total {
  id: string;
  value: number;

  constructor(id: string, value: number) {
    this.id = id;
    this.value = value;
  }
}

export class KeyValue {
  key: string;
  value: string;

  constructor(k: string, v: string) {
    this.key = k;
    this.value = v;
  }
}

export class CCTimedKeyValue {
  value: string;
  changed: number;
}

export class CCServiceInfo {
  id: string;
  schema: Map<string, Config>;
  config: Map<string, CCTimedKeyValue>;
  info: Map<string, string>;
  clients: Map<string, Map<string, any>>;
}

export class ServiceInfo {
  id: string;
  instances: Instance[];
  totals: Total[];
  schema: Config[];
  info: KeyValue[];

  public static fromCCData(data: CCServiceInfo) {
    // Collect schema info
    let retInfo = new ServiceInfo(data.id);
    for (const k in data.schema) {
      if (data.schema.hasOwnProperty(k)) {
        retInfo.schema.push(Config.fromData(k, data.schema[k]));
        console.log('Loading configuration: ' + k);
      }
    }
    // Collect configuration values
    for (const k in data.config) {
      if (data.config.hasOwnProperty(k)) {
        const so = retInfo.schema.find(o => o.key === k);
        if (so !== undefined) {
          const conf = data.config[k];
          if (conf.value === undefined) {
            conf.value = '';
          }
          so.value = conf.value;
          so.origValue = conf.value;
        }
      }
    }
    // Collect instance info
    for (const k in data.clients) {
      if (data.clients.hasOwnProperty(k)) {
        retInfo.instances.push(Instance.fromData(k, data.clients[k]));
      }
    }
    // Collect service info
    for (const k in data.info) {
      if (data.info.hasOwnProperty(k)) {
        retInfo.info.push(new KeyValue(k, data.info[k]));
      }
    }
    // Calculate totals
    return retInfo;
  }

  constructor(id: string) {
    this.id = id;
    this.instances = [];
    this.totals = [];
    this.schema = [];
    this.info = [];
  }
}

@Injectable()
export class ServicesService {

  serviceUrl = 'http://localhost:3000';
  constructor(private http: Http) {};

  handleError(reason: string): string[] {
    console.log('Error when loading services: ' + reason);
    return [];
  };

  getServiceInfo(id: string): Promise<CCServiceInfo> {
     const url = `${this.serviceUrl}/api/1/services/${id}`;
     return this.http.get(url)
       .toPromise()
       .then(response => response.json() as CCServiceInfo);
   }

  saveField(serviceId: string, key: string, value: string): Promise<string> {
    console.log('Saving ' + key + ' = ' + value);
    const url = `${this.serviceUrl}/api/1/services/${serviceId}"/keys/${key}"`;
    return this.http.put(url, value)
      .toPromise()
      .then(response => response.text() as string);
  }

  getServices(): Promise<string[]> {
     const url = `${this.serviceUrl}/api/1/services`;
     return this.http.get(url)
       .toPromise()
       .then(response => response.json().services as string[])
       .catch(this.handleError);
   }
}

