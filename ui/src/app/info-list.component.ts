import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ServiceInfo } from "./services.service";

@Component({
  selector: 'info-list',
  templateUrl: './info-list.component.html'
})

export class InfoListComponent {
  @Input() selectedService: ServiceInfo;
}
