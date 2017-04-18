import { Component, Input } from '@angular/core';

@Component({
  selector: 'service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent {
  services = ["foo", "bar"];
  @Input() selectedService: string;

  onSelect(service: string): void {
    this.selectedService = service;
    console.log(service);
  }
}
