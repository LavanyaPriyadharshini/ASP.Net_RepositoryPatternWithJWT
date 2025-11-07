import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { User } from '../../services/auth.service';

@Component({
  selector: 'app-usercard-child',
  imports: [],
  templateUrl: './usercard-child.component.html',
  styleUrl: './usercard-child.component.css'
})
export class UsercardChildComponent {

  //refer notes in ms word - page 3
 // @Input  - Receives data from the parent
@Input() user! : User;
@Input() isSelected: boolean = false;


 // ✅ @Output - Sends events TO parent
  @Output() userClicked = new EventEmitter<User>();
  @Output() userDeleted = new EventEmitter<number>();
  @Output() userEdited = new EventEmitter<User>();


    // Methods that emit events to parent
  onCardClick() {
    this.userClicked.emit(this.user);
  }


   onDelete(event: Event) {
    event.stopPropagation(); // Prevent card click
    this.userDeleted.emit(this.user.userId);
  }


    onEdit(event: Event) {
    event.stopPropagation();
    this.userEdited.emit(this.user);
  }


   getRoleBadgeColor(): string {
    switch(this.user.role) {
      case 'Admin': return 'badge-red';
      case 'HR': return 'badge-blue';
      case 'Evaluator': return 'badge-green';
      default: return 'badge-gray';
    }
  }


}
