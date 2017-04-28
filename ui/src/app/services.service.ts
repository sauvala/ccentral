import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import 'rxjs/add/operator/toPromise';


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
    this.metrics = [new Metric("in", 100), new Metric("status", "ok"), new Metric(id + " uniq", 1)]
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

  constructor(id: string, data: any) {
    this.id = id;
    this.instances = [new Instance("i1"), new Instance("i2")];
    this.totals = [new Total("Events in", 100), new Total("Failures", 40)]
  }
}

@Injectable()
export class ServicesService {

  constructor(private http: Http) {};
  serviceUrl = "";

  handleError(): void {
  };

  getServiceInfo(id: string): ServiceInfo {
    return new ServiceInfo(id, "");
  }

  getServices(): string[] {
    return ["service1", "service2", "service3"];
  }

  // getServices(): Promise<string[]> {
  //   const url = `${this.serviceUrl}`;
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(response => response.json().data as string[])
  //     .catch(this.handleError);
  // }
}

