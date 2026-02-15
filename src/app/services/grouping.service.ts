import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';

export interface UserGroup {
  name: string;
  users: User[];
}

export type ListRow =
  | { type: 'header'; name: string; count: number }
  | { type: 'user'; user: User };

export function flattenGroups(groups: UserGroup[]): ListRow[] {
  const rows: ListRow[] = [];
  for (const group of groups) {
    rows.push({ type: 'header', name: group.name, count: group.users.length });
    for (const user of group.users) {
      rows.push({ type: 'user', user });
    }
  }
  return rows;
}

@Injectable({
  providedIn: 'root',
})
export class GroupingService {
  private worker: Worker | null = null;

  groupUsers(users: User[], groupBy: string): Observable<UserGroup[]> {
    const subject = new Subject<UserGroup[]>();

    if (typeof Worker !== 'undefined') {
      if (!this.worker) {
        this.worker = new Worker(
          new URL('../workers/grouping.worker', import.meta.url),
        );
      }

      this.worker.onmessage = ({ data }) => {
        subject.next(data);
        subject.complete();
      };

      this.worker.postMessage({ users, groupBy });
    }

    return subject.asObservable();
  }
}
