import { Component, input } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserItemComponent } from '../user-item/user-item.component';
import { ListRow } from '../../services/grouping.service';
import { CountryNamePipe } from '../../pipes/country-name.pipe';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  imports: [UserItemComponent, ScrollingModule, CountryNamePipe],
})
export class UserListComponent {
  rows = input.required<ListRow[]>();
}
