import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent {
  @Output() selectEmit: EventEmitter<string> = new EventEmitter();
  @Input() services: string[];
  @Input() selectedService: string;

  emit(): void {
    this.selectEmit.emit(this.selectedService);
    console.log("Service selected: " + this.selectedService);
  }
}
