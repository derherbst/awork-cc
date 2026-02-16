import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { UsersService } from './services/users.service';
import { User } from './models/user.model';
import { UserListComponent } from './components/user-list/user-list.component';
import { Subject, catchError, debounceTime } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  usersService = inject(UsersService);
  groupingService = inject(GroupingService);

  rows = signal<ListRow[]>([]);
  loading = signal<boolean>(true);
  loadingMore = signal<boolean>(false);
  activeCriterion = signal<string>('nationality');
  searchTerm = signal<string>('');
  criteria = ['nationality', 'alphabetical', 'age'];

  private users: User[] = [];
  private groups: UserGroup[] = [];
  private expandedGroups = new Set<string>();
  private currentPage = 1;
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(200)).subscribe((term) => {
      this.searchTerm.set(term);
      this.expandedGroups.clear();
      this.regroup(this.activeCriterion());
    });
    this.fetchPage(1);
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadMore() {
    this.loadingMore.set(true);
    this.fetchPage(this.currentPage + 1);
  }

  private fetchPage(page: number) {
    this.usersService
      .getUsers(page)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((users) => {
        this.currentPage = page;
        this.users = [...this.users, ...users];
        this.regroup(this.activeCriterion());
        this.loadingMore.set(false);
      });
  }

  switchCriterion(criterion: string) {
    this.activeCriterion.set(criterion);
    this.expandedGroups.clear();
    this.rows.set([]);
    this.loading.set(true);
    this.regroup(criterion);
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchSubject.next(term);
  }

  toggleGroup(name: string) {
    if (this.expandedGroups.has(name)) {
      this.expandedGroups.delete(name);
    } else {
      this.expandedGroups.add(name);
    }
    this.rows.set(flattenGroups(this.groups, this.expandedGroups));
  }

  private get filteredUsers(): User[] {
    const term = this.searchTerm();
    if (!term) return this.users;
    return this.users.filter((u) => u.lastname?.toLowerCase().startsWith(term));
  }

  private regroup(criterion: string) {
    this.groupingService
      .groupUsers(this.filteredUsers, criterion)
      .subscribe((groups) => {
        this.groups = groups;
        this.expandedGroups = new Set(groups.length ? [groups[0].name] : []);
        this.rows.set(flattenGroups(groups, this.expandedGroups));
        this.loading.set(false);
      });
  }
}
