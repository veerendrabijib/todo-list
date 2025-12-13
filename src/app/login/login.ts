import { Component } from '@angular/core';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { ButtonComponent } from '../shared/button/button';

@Component({
 selector: 'app-login',
 templateUrl: './login.html',
 standalone: true,
 imports: [TextFieldComponent, ButtonComponent]
})
export class LoginComponent {
 name = '';
 password = '';
 error = { status: false, message: '' };
 email = '';
 isLogin = true;
 login() {
  if (this.isValidForm()) { }
  else {
   setTimeout(() => {
    this.error = { status: false, message: '' };
    console.log(this.error);
   }, 1000);
  }
 }
 navigateToSignUp() {
  this.isLogin = false;
 }
 isValidForm() {
  if (!this.name) {
   this.error = { status: true, message: 'Name is required' };
  }
  else if (!this.email && !this.isLogin) {
   this.error = { status: true, message: 'Email is required' };
  }
  else if (!this.password) {
   this.error = { status: true, message: 'Password is required' };
  }
  else this.error = { status: false, message: '' };
  return !this.error.status;
 }
}
