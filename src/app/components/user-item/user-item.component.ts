import { Component, input } from '@angular/core';
import { User } from '../../models/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
  imports: [DatePipe],
})
export class UserItemComponent {
  user = input.required<User>();
  expanded = true;

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
