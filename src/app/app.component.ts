import { Component, OnInit, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { UsersService } from './services/users.service';
import { User } from './models/user.model';
import { UserListComponent } from './components/user-list/user-list.component';
import { catchError } from 'rxjs';
import {
  GroupingService,
  UserGroup,
  ListRow,
  flattenGroups,
} from './services/grouping.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [UserListComponent, TitleCasePipe],
})
export class AppComponent implements OnInit {
  usersService = inject(UsersService);
  groupingService = inject(GroupingService);

  rows = signal<ListRow[]>([]);
  loading = signal<boolean>(true);
  activeCriterion = signal<string>('nationality');
  criteria = ['nationality', 'alphabetical', 'age'];

  private users: User[] = [];
  private groups: UserGroup[] = [];
  private expandedGroups = new Set<string>();

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
        this.users = users;
        this.regroup(this.activeCriterion());
      });
  }

  switchCriterion(criterion: string) {
    this.activeCriterion.set(criterion);
    this.expandedGroups.clear();
    this.rows.set([]);
    this.loading.set(true);
    this.regroup(criterion);
  }

  toggleGroup(name: string) {
    if (this.expandedGroups.has(name)) {
      this.expandedGroups.delete(name);
    } else {
      this.expandedGroups.add(name);
    }
    this.rows.set(flattenGroups(this.groups, this.expandedGroups));
  }

  private regroup(criterion: string) {
    this.groupingService
      .groupUsers(this.users, criterion)
      .subscribe((groups) => {
        this.groups = groups;
        this.expandedGroups = new Set(groups.map((g) => g.name));
        this.rows.set(flattenGroups(groups, this.expandedGroups));
        this.loading.set(false);
      });
  }
}
