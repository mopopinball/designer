import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MopoValidators {
  static distinct(values: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      if (!values.includes(value)) {
        return null;
      }

      return {
        distinct: 'not distinct',
      };

      //   const hasUpperCase = /[A-Z]+/.test(value);

      //   const hasLowerCase = /[a-z]+/.test(value);

      //   const hasNumeric = /[0-9]+/.test(value);

      //   const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

      //   return !passwordValid ? { passwordStrength: true } : null;
    };
  }
}
