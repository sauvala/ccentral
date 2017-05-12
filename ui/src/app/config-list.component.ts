import { Component, Input } from '@angular/core';
import { Config } from './services.service';

@Component({
  selector: 'config-list',
  templateUrl: 'config-list.component.html',
})
export class ConfigListComponent {
  @Input() configs: Config[];
  configValues = {};
}
