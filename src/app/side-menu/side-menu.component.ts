import { Component,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {

  @Input() showComponent: string = '';

  // Emit changes to the parent
  @Output() componentValueChange: EventEmitter<string> = new EventEmitter<string>();

  setComponent(value: string): void{

    let sendData :any = {value: value, data:''}
    console.log('sendData', sendData)
    this.componentValueChange.emit(sendData);
  }
}
