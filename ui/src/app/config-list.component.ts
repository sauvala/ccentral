import { Component, Input } from '@angular/core';
import { Config, ServicesService, ServiceInfo } from './services.service';

@Component({
  selector: 'config-list',
  templateUrl: 'config-list.component.html',
})
export class ConfigListComponent {

  @Input() selectedService: ServiceInfo;

  constructor(private servicesService: ServicesService) {
  };

  saveField(key: string, value: string) {
    this.servicesService.saveField(this.selectedService.id, key, value).then(r => {
      const field = this.selectedService.schema.find(o => o.key === key);
      field.origValue = value;
    });
  }
}
