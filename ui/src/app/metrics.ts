export class Metric {
  public _key: string;
  public _value: any;

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

  public static fromData(key: string, value: any) {
    if (key === 'started') {
      return new TimeDeltaMetric(key, value);
    } else if (key.startsWith("c_")) {
      return new CounterMetric(key, value);
    } else if (key.startsWith("k_")) {
      return new CustomKeyMetric(key, value);
    }
    return new Metric(key, value);
  }

  constructor(key: string, value: any) {
    this._key = key;
    this._value = value;
  }
}

export class TimeDeltaMetric extends Metric {
  
  public value() : string {
    let v = ((new Date).getTime()/1000 - parseInt(this._value))/60;
    if (v < 1) {
        return "Just now";
    } else if (v > 60*24) {
        return "" + Math.round(v/(60*24)) + " days";
    }
    return "" + Math.round(v) + " min";
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
    let data = this._value as Number[]
    if (data === undefined) {
      return "N/A";
    }
    return String(data[0])
  }

  public groupValues(otherValues: any): any {
    otherValues = otherValues as Number
    let data = this._value as Number[]
    if (data === undefined || data.length === 0) {
      return otherValues;
    }
    if (otherValues === undefined) {
      return Number(data[0]);
    }
    return otherValues + data[0];
  }
}