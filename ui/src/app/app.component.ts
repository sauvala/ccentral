import { Component, Input, OnInit } from '@angular/core';

import { Config, ServicesService, CCServiceInfo, ServiceInfo } from './services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  selectedService: ServiceInfo;
  services: string[];
  updateServices = (newServiceList: string[]) => {
    this.services = newServiceList;
  }

  updateServiceInfo = (ccServiceData: CCServiceInfo) => {
    if (ccServiceData != null) {
      this.selectedService = ServiceInfo.fromCCData(ccServiceData);
      console.log(ccServiceData);
    }
    console.log('New service data available for: ' + this.selectedService.id);
  }

  constructor(private servicesService: ServicesService) {
    this.selectedService = undefined;
    this.services = [];
  };

  ngOnInit(): void {
    this.servicesService.getServices().then(this.updateServices,
      function(reason) {
        console.log('Service loading failed');
      });
    console.log('App component init');
  }

  selectService(event: string): void {
    this.servicesService.getServiceInfo(event).then(this.updateServiceInfo);
  }
}
