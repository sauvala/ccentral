import { Component, Input } from '@angular/core';
import { Instance } from './services.service';

export class Tag {
  text: string;
  type: string;

  constructor(text, type) {
    this.text = text;
    this.type = type;
  }
}

@Component({
  selector: 'instance-list',
  templateUrl: 'instance-list.component.html',
})
export class InstanceListComponent {
  @Input() instances: Instance[];

  representValue(header: string, instance: Instance): string {
    let metric = instance.metrics.find(item => item._key === header);
    if (metric === undefined) {
      return "N/A";
    }
    return metric.value();
  }

  headerKeys(): string[] {
    let headers = new Set<string>();
    this.instances.forEach(instance => {
      instance.metrics.forEach(metric => {
        headers.add(metric._key);
      });
    });
    return Array.from(headers.keys());
  }

  headers(): string[] {
    let headers = new Set<string>();
    this.instances.forEach(instance => {
      instance.metrics.forEach(metric => {
        headers.add(metric.title());
      });
    });
    return Array.from(headers.keys());
  }

  tags(): Tag[] {
    return [];
  }

}
