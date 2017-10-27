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

  updateServiceInfo = (serviceInfo: CCServiceInfo) => {
    this.selectedService = new ServiceInfo(serviceInfo.id);
    if (serviceInfo != null) {
      for (const k in serviceInfo.schema) {
        if (serviceInfo.schema.hasOwnProperty(k)) {
          this.selectedService.schema.push(Config.fromData(k, serviceInfo.schema[k]));
          console.log('Loading configuration: ' + k);
        }
      }
      for (const k in serviceInfo.config) {
        if (serviceInfo.config.hasOwnProperty(k)) {
          const so = this.selectedService.schema.find(o => o.key === k);
          if (so !== undefined) {
            const conf = serviceInfo.config[k];
            if (conf.value === undefined) {
              conf.value = '';
            }
            so.value = conf.value;
            so.origValue = conf.value;
          }
        }
      }
      //console.log(serviceInfo.config)
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
