import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Config, ServicesService, CCServiceInfo, ServiceInfo } from './services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  selectedService: ServiceInfo;
  loading: boolean;
  services: string[];

  updateServices = (newServiceList: string[]) => {
    this.services = newServiceList;
  }

  updateServiceInfo = (ccServiceData: CCServiceInfo) => {
    this.loading = false;
    if (ccServiceData != null) {      
      let newServiceData = ServiceInfo.fromCCData(ccServiceData);
      if (this.selectedService === undefined || this.selectedService.id !== newServiceData.id) {
        this.selectedService = newServiceData;
      } else {
        this.selectedService.info = newServiceData.info;
        this.selectedService.totals = newServiceData.totals;
        this.selectedService.instances = newServiceData.instances;
      }
    }
    console.log('New service data available for: ' + this.selectedService.id);
  }

  constructor(private servicesService: ServicesService) {
    this.selectedService = undefined;
    this.services = [];
  };

  refreshServicePoll() {
    if (this.selectedService !== undefined) {
      console.log("Reloading..");
      this.loading = true;
      this.servicesService.getServiceInfo(this.selectedService.id).then(this.updateServiceInfo);
    }
  }

  ngOnInit(): void {    
    this.servicesService.getServices().then(this.updateServices,
      function(reason) {
        console.log('Service loading failed');
      });
    let timer = Observable.timer(2000, 2000);
    timer.subscribe(t => this.refreshServicePoll());
    console.log('App component init');
  }

  selectService(event: string): void {
    this.servicesService.getServiceInfo(event).then(this.updateServiceInfo);
  }
}
