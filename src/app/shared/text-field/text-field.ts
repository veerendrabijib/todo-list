import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
 selector: 'app-text-field',
 templateUrl: './text-field.html'
})
export class TextFieldComponent {
 @Input() label: string = '';
 @Input() type: string = 'text';
 @Input() placeholder: string = '';
 @Input() value: string = '';
 @Input() error: string = '';
 @Input() disabled: boolean = false;
 @Output() valueChange = new EventEmitter<string>();

 onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  this.valueChange.emit(input.value);
 }
}