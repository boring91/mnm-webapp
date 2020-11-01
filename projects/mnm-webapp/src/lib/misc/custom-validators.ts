import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

// @dynamic
export class CustomValidators {

  private static dateRegex = '^(?:(?:31(-)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(-)(?:0?[1,3-9]|1[0-2])\\2))' +
    '(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(-)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?' +
    '(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|' +
    '^(?:0?[1-9]|1\\d|2[0-8])(-)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?' +
    '\\d{2})$';

  private static timeRegex = '(?:^$|^(?:[0-1]\\d|2[0-3]):[0-5]\\d$)';

  // NOTE: put a change detector on the field
  public static requiredIf(field: string, hasValue?: any): (c: AbstractControl) => ValidationErrors {
    return (c: AbstractControl) => {
      if (!c.parent) {
        return null;
      }
      const result = c.parent.controls[field].value === hasValue && !c.value;
      return result ? { requiredif: true } : null;
    };
  }

  // NOTE: put a change detector on the field (this one can cause problem due
  // to unreleased subscription)
  public static match(matchWith: string): (c: AbstractControl) => ValidationErrors {
    return (c: AbstractControl) => {
      if (!c.parent) {
        return null;
      }
      const matched = c.value || undefined;

      let subscription = (c as any).matchWithSubscription;

      if (!subscription) {
        const formGroup = <FormGroup>c.parent;
        subscription = formGroup.controls[matchWith].valueChanges.subscribe((matchingValue) => {
          (c as any).matchingValue = matchingValue;
          c.updateValueAndValidity();
        });
        (c as any).matchWithSubscription = subscription;
      }

      const result = matched === (c as any).matchingValue;

      console.log({ matched, matching: (c as any).matchingValue })

      return result ? null : { match: true };
    };
  }

  public static requiredPropertyInObject(property: string): (c: AbstractControl) => ValidationErrors {
    return (c: AbstractControl) => {
      if (!c.parent) {
        return null;
      }
      return c.value && c.value[property] ? null : { required: true };
    };
  }

  public static date(c: AbstractControl): ValidationErrors {
    let value = c.value;
    if (c.value instanceof Object) {
      if (c.value['formatted']) {
        value = c.value['formatted'];
      }
    }
    if (!value || value === '' || value.match(CustomValidators.dateRegex)) {
      return null;
    }
    return { date: true };
  }

  public static time(c: AbstractControl): ValidationErrors {
    if (!c.value || c.value === '' || c.value.match(CustomValidators.timeRegex)) {
      return null;
    }
    return { time: true };
  }

  public static number(c: AbstractControl): ValidationErrors {
    if (!c.value || c.value === '' || c.value.match('^\\-?(?:\\d+)?(?:\\.?\\d+)$')) {
      return null;
    }
    return { number: true };
  }

  public static phone(c: AbstractControl): ValidationErrors {
    if (!c.value || c.value === '' || c.value.match('^\\-?(?:\\d+)?(?:\\.?\\d+)$')) {
      // if (!c.value || c.value === '' || c.value.match('^(?:971|\\+971|0)?5[024568][1-9][\\d]{6}$')) {
      return null;
    }
    return { phone: true };
  }

  public static integer(c: AbstractControl): ValidationErrors {
    if (!c.value || c.value === '' || `${c.value}`.match('^\\d+$')) {
      return null;
    }
    return { integer: true };
  }

  public static maxFileSize(maxFileSize: number, maxFileSizeDisplay: string = ''): (c: AbstractControl) => ValidationErrors {
    return (c: AbstractControl) => {
      if (!c.value || c.value === '') {
        return null;
      }

      const fileSize = (c.value.length * (3 / 4)) - (c.value.endsWith('==') ? 2 : c.value.endsWith('=') ? 1 : 0);

      return fileSize > maxFileSize ? { maxfilesize: { maxFileSize, maxFileSizeDisplay } } : null;
    }
  }
}
