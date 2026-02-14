import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { User } from '../models/user.model';
import { MockResult } from '../mock-data';
import { UserResult } from '../models/api-result.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  /**
   * Simulates fetching 5000 users from an API using mock data.
   * The original randomuser.me API is unavailable, so we use the provided
   * mock data (300 entries) and cycle it to reach the target count.
   */
  getUsers(page = 1, count = 5000): Observable<User[]> {
    const baseResults = MockResult.results as UserResult[];
    const results: UserResult[] = [];

    for (let i = 0; i < count; i++) {
      results.push(baseResults[i % baseResults.length]);
    }

    return of(results).pipe(
      delay(500),
      map((users) => User.mapFromUserResult(users)),
    );
  }
}
