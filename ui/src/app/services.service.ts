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
  key: string;
  value: any;

  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }
}

export class Instance {
  id: string;
  metrics: Metric[];

  constructor(id: string) {
    this.id = id;
    this.metrics = [new Metric('in', 100), new Metric('status', 'ok'), new Metric(id + ' uniq', 1)]
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

export class CCTimedKeyValue {
  value: string;
  changed: number;
}

export class CCServiceInfo {
  id: string;
  schema: Map<string, Config>;
  config: Map<string, CCTimedKeyValue>;
}

export class ServiceInfo {
  id: string;
  instances: Instance[];
  totals: Total[];
  schema: Config[];
  //configs: Map<string, Config>;

  constructor(id: string) {
    this.id = id;
    this.instances = [new Instance('i1'), new Instance('i2')];
    this.totals = [new Total('Events in', 100), new Total('Failures', 40)]
    this.schema = [];
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

