import { Component, input } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { User } from '../../models/user.model';
import { UserItemComponent } from '../user-item/user-item.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  imports: [UserItemComponent, ScrollingModule],
})
export class UserListComponent {
  users = input.required<User[]>();
}
