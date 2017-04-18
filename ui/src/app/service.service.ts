import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ServiceService {

  constructor(private http: Http) {};
  serviceUrl = "";

  handleError(): void {
  };

  getServices(): Promise<string[]> {
    const url = `${this.serviceUrl}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as string[])
      .catch(this.handleError);
  }
}

