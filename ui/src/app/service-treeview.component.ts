import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'service-treeview',
  templateUrl: './service-treeview.component.html',
})
export class ServiceTreeviewComponent {
  @Output() selectEmit: EventEmitter<string> = new EventEmitter();
  @Input() services: string[];
  @Input() selectedService: string;

  emit(service: string): void {
    this.selectedService = service;
    this.selectEmit.emit(this.selectedService);
    console.log("Service selected: " + this.selectedService);
  }
}
