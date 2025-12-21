import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header';
import { TableComponent, TableHeader } from '../shared/table/table';
import { ButtonComponent } from '../shared/button/button';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { DatepickerComponent } from '../shared/datepicker/datepicker';
import { ApiManager } from '../utils/api-manager';
import { Constants } from '../utils/constants';
import { CommonModule } from '@angular/common';


interface Todo {
 title: string;
 date: string;
 createdAt?: string;
 id?: string;
}
@Component({
 selector: 'app-dashboard',
 standalone: true,
 imports: [FormsModule, HeaderComponent, TableComponent, ButtonComponent, TextFieldComponent, DatepickerComponent, CommonModule],
 templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
 todoTitle = '';
 todoDate = '';
 todoData: Todo[] = [];
 editId: number | null = null;
 tableHeaders: TableHeader[] = []
 openTodoModal: boolean = false;
 minDate: string = new Date().toISOString().split('T')[0];
 loginData: { userId: string, userName: string } | null = JSON.parse(localStorage.getItem('loginData') || 'null');
 todo: Todo = { title: '', date: '' };
 isDataLoaded = false;
 private readonly api = inject(ApiManager)
 ngOnInit() {
  this.setupTable();
 }
 setupTable() {
  this.tableHeaders = [
   { key: 'title', label: 'Title' },
   { key: 'todoDateDMY', label: 'Date' },
   { key: 'edit', label: 'Edit', action: 'edit', icon: 'fas fa-edit' },
   { key: 'delete', label: 'Delete', action: 'delete', icon: 'fas fa-trash' }
  ];
  this.fetchTodos();
 }
 handleTableAction(event: any) {
  console.log('Table action:', event);
 }
 onAddTodo() {
  this.openTodoModal = true;
 }
 saveTodo() {
  console.log('Saving todo:', this.todo);
   const payload = {
    title: this.todo.title,
    todoDate: this.todo.date,
    userId: this.loginData?.userId
  };
  this.api.doPost(Constants.TODOS_ENDPOINT, payload ).subscribe({
   next: (response) => {
    console.log('Todo saved successfully:', response);
    this.openTodoModal = false;
    this.fetchTodos();
   },
   error: (error) => {
    console.error('Error saving todo:', error);
   }
  });
 }
 fetchTodos() {
  this.isDataLoaded = false;
  this.api.doPost(Constants.TODOS_ENDPOINT + '/fetch', { userId: this.loginData?.userId }).subscribe({
   next: (res: any) => {
    this.todoData = (res.data || []).map((item: any) => ({
          title: item.title,
          todoDateDMY: item.todoDateDMY  // 👈 EXACT MATCH
        }));
    console.log('Fetched todos:', this.todoData);
     this.isDataLoaded = true;
   },
   error: (error) => {
     this.isDataLoaded = true;
    console.error('Error fetching todos:', error);
   }
  });
 }
}
