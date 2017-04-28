import { Component, Input } from '@angular/core';

@Component({
  selector: 'status-box',
  templateUrl: 'status-box.component.html',
})
export class StatusBoxComponent {
  @Input() title: string[];
  @Input() value: string;
  @Input() faIcon: string;
}
