import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../models/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserItemComponent {
  user = input.required<User>();
  expanded = false;

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
