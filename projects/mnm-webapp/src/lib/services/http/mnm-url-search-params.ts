import {HttpParams} from '@angular/common/http';

export class MNMUrlSearchParams {

  paramsMap: Map<string, string[]> = new Map();

  convert(): HttpParams {
    let params = new HttpParams();
    this.paramsMap.forEach((values, k) => {
      if (values.length > 1) {
        for (const v of values) {
          params = params.append(k, v);
        }
      } else {
        params = params.set(k, values[0]);
      }
    });

    return params;
  }

  has(param: string): boolean {
    return this.paramsMap.get(param) && this.paramsMap.get(param).length !== 0;
  }

  get(param: string): string | null {
    const value = this.paramsMap.get(param);
    return !value || value.length === 0 ? null : value[0];
  }

  getAll(param: string): string[] {
    const value = this.paramsMap.get(param);
    return !value ? [] : value;

  }

  set(param: string, val: string): void {
    this.paramsMap.set(param, [val]);
  }

  append(param: string, val: string): void {
    let value = this.paramsMap.get(param);
    if (!value) {
      value = [];
    }
    value.push(val);
    this.paramsMap.set(param, value);
  }


  toString(): string {
    let str = '';
    for (const k of Object.keys(this.paramsMap.keys())) {
      const values = this.getAll(k);
      for (const v of values) {
        str += encodeURIComponent(k) + '=' + encodeURIComponent(v) + '&';
      }
    }
    return str.slice(0, str.length - 1);
  }

  delete(param: string): void {
    this.paramsMap.delete(param);
  }
}
