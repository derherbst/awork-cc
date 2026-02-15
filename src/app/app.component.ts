import { Component, OnInit, inject, signal } from '@angular/core';
import { UsersService } from './services/users.service';
import { UserListComponent } from './components/user-list/user-list.component';
import { catchError } from 'rxjs';
import { GroupingService, ListRow, flattenGroups } from './services/grouping.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [UserListComponent],
})
export class AppComponent implements OnInit {
  usersService = inject(UsersService);
  groupingService = inject(GroupingService);
  rows = signal<ListRow[]>([]);

  ngOnInit(): void {
    this.usersService
      .getUsers()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((users) => {
        this.groupingService
          .groupUsers(users, 'nationality')
          .subscribe((groups) => {
            this.rows.set(flattenGroups(groups));
          });
      });
  }
}
