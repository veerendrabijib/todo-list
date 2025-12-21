import { Component, inject, signal } from '@angular/core';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { ButtonComponent } from '../shared/button/button';
import { ApiManager } from '../utils/api-manager';
import { Constants } from '../utils/constants';
import { Router } from '@angular/router';

@Component({
 selector: 'app-login',
 standalone: true,
 templateUrl: './login.html',
 imports: [TextFieldComponent, ButtonComponent]
})
export class LoginComponent {
 message = signal<{ status: boolean; text: string; isError: boolean }>({
  status: false,
  text: '',
  isError: true
 });
 postParams = { name: '', email: '', password: '' };
 isLogin: boolean = true;
 private readonly api = inject(ApiManager);
 private readonly router = inject(Router)

 login() {
  if (!this.isValidForm()) return;
  const url = this.isLogin ? Constants.LOGIN_ENDPOINT : Constants.LOGIN_ENDPOINT + '/signup';
  this.api.doPost(url, this.postParams).subscribe({
   next: (res: any) => {
    if (res.status) {
     console.log('Response:', res);
     this.saveToLocalStorage({ userId: res.userId, name: res.userName });
     this.showMessage(res.message || (this.isLogin ? 'Login successful' : 'Sign Up successful'), false);
     if (!this.isLogin) {
      this.navigateToLogin();
     } else {
      this.navigateToDashboard();
     }
    }
   },
   error: (err: any) => {
    this.showMessage(err.error.message || 'Request failed');
   }
  });
 }
 navigateToSignUp() {
  this.clearForm();
  this.isLogin = false;
 }
 navigateToLogin() {
  this.clearForm();
  this.isLogin = true;
 }
 navigateToDashboard() {
  this.router.navigateByUrl('/dashboard', { replaceUrl: true });
 }
 isValidForm(): boolean {
  if (!this.postParams.name) {
   this.showMessage('Name is required');
   return false;
  }
  if (!this.isLogin && !this.postParams.email) {
   this.showMessage('Email is required');
   return false;
  }
  if (!this.postParams.password) {
   this.showMessage('Password is required');
   return false;
  }
  return true;
 }
 showMessage(text: string, isError: boolean = true) {
  this.message.set({ status: true, text, isError });

  setTimeout(() => {
   this.message.set({ status: false, text: '', isError: true });
  }, 2000);
 }
 clearForm() {
  this.postParams = { name: '', email: '', password: '' };
 }
 saveToLocalStorage(data: any) {
  localStorage.setItem('loginData', JSON.stringify(data));
 }
}
