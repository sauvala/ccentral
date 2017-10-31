import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Metric, TotalMetric } from './metrics';

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
  bigValue: string;
  smallValue: string;
  title: string;

  constructor(id: string, title: string, bigValue: string, smallValue: string) {
    this.id = id;
    this.title = title;
    this.bigValue = bigValue;
    this.smallValue = smallValue;
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
    const totals = new Map<string, TotalMetric>();
    const titles = new Map<string, string>();
    retInfo.instances.forEach(instance => {
      instance.metrics.forEach(metric => {
        let v = totals[metric._key];
        v = metric.groupValues(v);
        if (v !== undefined) {
          totals[metric._key] = v;
          titles[metric._key] = metric.title();
        }
      });
    });
    for (const k in totals) {
      if (totals.hasOwnProperty(k)) {
        const v = totals[k] as TotalMetric;
        retInfo.totals.push(new Total(k, v.outputTitle, v.outputBig, v.outputSmall));
      }
    };

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

