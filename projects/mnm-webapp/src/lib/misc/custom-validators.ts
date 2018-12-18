import {AbstractControl, FormGroup, ValidationErrors} from '@angular/forms';

// @dynamic
export class CustomValidators {

  private static dateRegex = '^(?:(?:31(-)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(-)(?:0?[1,3-9]|1[0-2])\\2))' +
    '(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(-)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?' +
    '(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|' +
    '^(?:0?[1-9]|1\\d|2[0-8])(-)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?' +
    '\\d{2})$';

  private static timeRegex = '(?:^$|^(?:[0-1]\\d|2[0-3]):[0-5]\\d$)';

  // NOTE: put a change detector on the field
  static requiredIf(field: string, hasValue?: any): (c: AbstractControl) => ValidationErrors {
    return (c: AbstractControl) => {
      if (!c.parent) {
        return null;
      }
      const result = c.parent.controls[field].value === hasValue && !c.value;
      return result ? {requiredif: true} : null;
    };
  }

  // NOTE: put a change detector on the field (this one can cause problem due
  // to unreleased subscription)
  static match(matchWith: string): (c: AbstractControl) => ValidationErrors {
    return (c: AbstractControl) => {
      if (!c.parent) {
        return null;
      }
      const matched = c.value;
      const formGroup = <FormGroup>c.parent;
      formGroup.controls[matchWith].valueChanges.subscribe(() => {
        c.updateValueAndValidity();
      });
      const matching = c.parent.value[matchWith];
      const result = matched === matching;
      return result ? null : {match: true};
    };
  }

  static requiredPropertyInObject(property: string): (c: AbstractControl) => ValidationErrors {
    return (c: AbstractControl) => {
      if (!c.parent) {
        return null;
      }
      return c.value && c.value[property] ? null : {required: true};
    };
  }

  static date(c: AbstractControl): ValidationErrors {
    let value = c.value;
    if (c.value instanceof Object) {
      if (c.value['formatted']) {
        value = c.value['formatted'];
      }
    }
    if (!value || value === '' || value.match(CustomValidators.dateRegex)) {
      return null;
    }
    return {date: true};
  }

  static time(c: AbstractControl): ValidationErrors {
    if (!c.value || c.value === '' || c.value.match(CustomValidators.timeRegex)) {
      return null;
    }
    return {time: true};
  }

  static number(c: AbstractControl): ValidationErrors {
    if (!c.value || c.value === '' || c.value.match('^\\-?(?:\\d+)?(?:\\.?\\d+)$')) {
      return null;
    }
    return {number: true};
  }

  static phone(c: AbstractControl): ValidationErrors {
    if (!c.value || c.value === '' || c.value.match('^\\-?(?:\\d+)?(?:\\.?\\d+)$')) {
      // if (!c.value || c.value === '' || c.value.match('^(?:971|\\+971|0)?5[024568][1-9][\\d]{6}$')) {
      return null;
    }
    return {phone: true};
  }

  static integer(c: AbstractControl): ValidationErrors {
    if (!c.value || c.value === '' || `${c.value}`.match('^\\d+$')) {
      return null;
    }
    return {integer: true};
  }
}
