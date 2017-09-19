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

  constructor(title: string, description: string, type: string, dValue: string) {
    this.title = title;
    this.description = description;
    this.type = type;
    this.default = dValue;
    this.key = '';
    this.value = '';
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

export class ServiceInfo {
  id: string;
  instances: Instance[];
  totals: Total[];
  // schema: Map<string, Config>;
  schema: Object;
  configs: Config[];

  constructor(id: string, data: any) {
    this.id = id;
    this.instances = [new Instance('i1'), new Instance('i2')];
    this.totals = [new Total('Events in', 100), new Total('Failures', 40)]
    this.schema = new Map();
    this.schema['str_default'] = new Config('String - Default value', 'Example string with default value', 'string', 'default');
    this.schema['str_default'] = new Config('String - Set value', 'Example string with set value', 'string', 'default')
    //    this.configs = [
//      new Config("str_default", "String - Default value", "Example string with default value", "string", "", "default"),
//      new Config("str_value", "String - Set value", "Example string with set value", "string", "new value", "default")
//    ]
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

  getServiceInfo(id: string): Promise<ServiceInfo> {
     const url = `${this.serviceUrl}/api/1/services/${id}`;
     return this.http.get(url)
       .toPromise()
       .then(response => response.json() as ServiceInfo);
   }

  getServices(): Promise<string[]> {
     const url = `${this.serviceUrl}/api/1/services`;
     return this.http.get(url)
       .toPromise()
       .then(response => response.json().services as string[])
       .catch(this.handleError)
   }
}

