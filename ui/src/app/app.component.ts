import { Component, Input, OnInit } from '@angular/core';

import { ServicesService, ServiceInfo } from './services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  selectedService: ServiceInfo;
  services: string[];
  updateServices = (newServiceList: string[]) => {this.services = newServiceList};
  updateServiceInfo = (serviceInfo: ServiceInfo) => {this.selectedService = serviceInfo};

  constructor(private servicesService: ServicesService) {
    this.selectedService = undefined;
    this.services = [];
  };

  ngOnInit(): void {
    this.servicesService.getServices().then(this.updateServices,
      function(reason) {
        console.log("Service loading failed");        
      });
    console.log("App component init");
  }

  selectService(event: string): void {
    this.servicesService.getServiceInfo(event).catch(this.updateServiceInfo);
    console.log("New service data available for: " + this.selectedService.id);
  }
}
