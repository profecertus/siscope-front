import { Component } from '@angular/core';
import { DValidateRules } from 'ng-devui/form';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FormLayout } from 'ng-devui';

@Component({
  selector: 'da-vertical-form',
  templateUrl: './vertical-form.component.html',
  styleUrls: ['./vertical-form.component.scss'],
})
export class VerticalFormComponent {
  existUsernames = ['Lily', 'Goffy', 'Nancy'];

  formData = {
    userName: '',
    password: '',
    confirmPassword: '',
  };

  verticalLayout: FormLayout = FormLayout.Vertical;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    usernameRules: {
      validators: [
        { required: true },
        { minlength: 3 },
        { maxlength: 128 },
        {
          pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/,
          message: {
            'es-PE': 'El nombre de usuario no puede contener caracteres extraños',
            'en-us': 'The user name cannot contain characters except uppercase, lowercase letters or numbers.'
          },
        },
      ],
      asyncValidators: [{ sameName: this.checkName.bind(this), message: {
        'es-PE': 'Nombre duplicado',
        'en-us': 'Duplicate name.'
      } }],
    },
    passwordRules: {
      validators: [{ required: true }, { minlength: 6 }, { maxlength: 15 }, { pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/ }],
      message: {
        'es-PE': 'Ingrese el password entre 6 y 15 digitos entre letras y numeros',
        'en-us': 'Enter a password that contains 6 to 15 digits and letters.'
      }
    },
    confirmPasswordRules: [
      { required: true },
      { sameToPassWord: this.sameToPassWord.bind(this), message: {
        'es-PE': 'Asegurese que los passwords son iguales',
        'en-us': 'Ensure that the two passwords are the same.'
        }
      },
      { minlength: 6 },
      { maxlength: 15 },
      { pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/, message: {
        'es-PE': 'El password debe contener solo letras y numeros',
        'en-us': 'The password must contain only letters and digits.'
        }
      },
    ],
  };

  checkName(value) {
    let res = true;
    if (this.existUsernames.indexOf(value) !== -1) {
      res = false;
    }
    return of(res).pipe(delay(500));
  }

  sameToPassWord(value) {
    return value === this.formData.password;
  }
}
