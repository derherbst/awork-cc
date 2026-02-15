import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserItemComponent } from '../user-item/user-item.component';
import { ListRow } from '../../services/grouping.service';
import { CountryNamePipe } from '../../pipes/country-name.pipe';
import { CountryFlagPipe } from '../../pipes/country-flag.pipe';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  imports: [UserItemComponent, ScrollingModule, CountryNamePipe, CountryFlagPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  rows = input.required<ListRow[]>();
  criterion = input<string>('nationality');
  headerToggle = output<string>();

  onHeaderClick(name: string) {
    this.headerToggle.emit(name);
  }
}
