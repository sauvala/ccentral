export class TotalMetric {
  public values: Map<string, any>;
  public outputBig: string;
  public outputSmall: string;
  public outputTitle: string;

  constructor(title: string) {
    this.values = new Map<string, any>();
    this.outputTitle = title;
  }
}

export class Metric {
  public _key: string;
  public _value: any;

  public static fromData(key: string, value: any) {
    if (key === 'started') {
      return new TimeDeltaMetric(key, value);
    } else if (key.startsWith('c_')) {
      return new CounterMetric(key, value);
    } else if (key.startsWith('k_')) {
      return new CustomKeyMetric(key, value);
    } else if (key.startsWith('h_')) {
      return new HistogramMetric(key, value);
    }
    return new Metric(key, value);
  }

  public title(): string {
    return this._key[0].toUpperCase() + this._key.substring(1);
  }

  public value(): string {
    return this._value;
  }

  /**
   * Method for handling data grouping needed for service totals.
   * @param otherValues Value from previous metric.
   */
  public groupValues(otherValues: any): any {
    return undefined;
  }

  constructor(key: string, value: any) {
    this._key = key;
    this._value = value;
  }
}

export class HistogramMetric extends Metric {
  public title(): string {
    return this._key[2].toUpperCase() + this._key.substring(3);
  }

  public value(): string {
    const data = this._value as Number[];
    if (data === undefined) {
      return 'N/A';
    }
    const p75 = data[0];
    const p95 = data[1];
    const p99 = data[2];
    const median = data[3];
    return String(p75) + '/' + String(p95) + '/' + String(p99) + '/' + String(median);
  }

  public groupValues(totalMetric: TotalMetric): TotalMetric {
    const data = this._value as Number[];
    if (data === undefined || data.length === 0) {
      return totalMetric;
    }

    if (totalMetric === undefined) {
      totalMetric = new TotalMetric(this.title() + ' median');
      totalMetric.values['p75'] = Number(data[0]);
      totalMetric.values['p95'] = Number(data[1]);
      totalMetric.values['p99'] = Number(data[2]);
      totalMetric.values['median'] = Number(data[3]);
    } else {
      totalMetric.values['p75'] = Math.floor((Number(data[0]) + Number(totalMetric.values['p75'])) / 2);
      totalMetric.values['p95'] = Math.floor((Number(data[1]) + Number(totalMetric.values['p95'])) / 2);
      totalMetric.values['p99'] = Math.floor((Number(data[2]) + Number(totalMetric.values['p99'])) / 2);
      totalMetric.values['median'] = Math.floor((Number(data[3]) + Number(totalMetric.values['median'])) / 2);
    }
    totalMetric.outputBig = String(totalMetric.values['median']) + ' / ' +
                            String(totalMetric.values['p75']) + ' / ' +
                            String(totalMetric.values['p95']) + ' / ' +
                            String(totalMetric.values['p99']);
    totalMetric.outputSmall = 'median / 75 / 95 / 99';
    return totalMetric;
  }
}

export class TimeDeltaMetric extends Metric {
  public value(): string {
    const v = ((new Date).getTime() / 1000 - parseInt(this._value, 10)) / 60;
    if (v < 1) {
        return 'Just now';
    } else if (v > 60 * 24) {
        return '' + Math.round(v / ( 60 * 24)) + ' days';
    }
    return '' + Math.round(v) + ' min';
  }
}

export class CustomKeyMetric extends Metric {

  public title(): string {
    return this._key[2].toUpperCase() + this._key.substring(3);
  }
}

export class CounterMetric extends Metric {

  public title(): string {
    return this._key[2].toUpperCase() + this._key.substring(3);
  }

  public value(): string {
    const data = this._value as Number[];
    if (data === undefined) {
      return 'N/A';
    }
    return String(data[0]);
  }

  public groupValues(totalMetric: TotalMetric): TotalMetric {
    const data = this._value as Number[];
    if (data === undefined || data.length === 0) {
      return totalMetric;
    }

    if (totalMetric === undefined) {
      totalMetric = new TotalMetric(this.title() + ' 1/min');
      totalMetric.values['total'] = Number(data[0]);
      totalMetric.values['min'] = Number(data[0]);
      totalMetric.values['max'] = Number(data[0]);
    } else {
      const totalValue = Number(totalMetric.values.get('total'));
      totalMetric['total'] = totalValue + Number(data[0]);
      totalMetric['min'] = Math.min(Number(totalMetric['min']), Number(data[0]));
      totalMetric['max'] = Math.max(Number(totalMetric['max']), Number(data[0]));
    }
    totalMetric.outputBig = String(totalMetric.values['total']);
    totalMetric.outputSmall =  'min ' + String(totalMetric.values['min'] + ', max ' + totalMetric.values['max']);
    return totalMetric;
  }
}
