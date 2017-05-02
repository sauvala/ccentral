import { Component, Input } from '@angular/core';

@Component({
  selector: 'service-info',
  templateUrl: 'service-info.component.html',
})
export class ServiceInfoComponent {
  @Input() title: string[];
  @Input() value: string;
  @Input() faIcon: string;
}
