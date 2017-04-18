import { Component, Input, OnInit } from '@angular/core';

import { ServiceService } from './service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  selectedService = "Nothing";

  constructor(private serviceService: ServiceService) {};
  
  ngOnInit(): void {
    this.serviceService.getServices();
  }
}
