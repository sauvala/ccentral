import { Component, Input, OnInit } from '@angular/core';

import { ServicesService, ServiceInfo } from './services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  selectedService: ServiceInfo;
  services = [];

  constructor(private servicesService: ServicesService) {};

  ngOnInit(): void {
    this.services = this.servicesService.getServices();
    console.log("App component init");
  }

  selectService(event: string): void {
    this.selectedService = this.servicesService.getServiceInfo(event);
    console.log("New service data available for: " + this.selectedService.id);
  }
}
