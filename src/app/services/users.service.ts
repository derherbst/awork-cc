import { Injectable } from '@angular/core';
import { Observable, of, map, shareReplay, catchError } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { ApiResult, UserResult } from '../models/api-result.model';
import { MockResult } from '../mock-data';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'https://randomuser.me/api';
  private pageCache = new Map<number, Observable<User[]>>();

  constructor(private httpClient: HttpClient) {}

  getUsers(page = 1): Observable<User[]> {
    if (!this.pageCache.has(page)) {
      const page$ = this.httpClient
        .get<ApiResult>(`${this.apiUrl}?results=5000&seed=awork&page=${page}`)
        .pipe(
          map((apiResult) => User.mapFromUserResult(apiResult.results)),
          catchError(() => {
            console.warn('API unavailable, falling back to mock data');
            const mockResults = MockResult.results as UserResult[];
            return of(User.mapFromUserResult(mockResults));
          }),
          shareReplay(1),
        );
      this.pageCache.set(page, page$);
    }
    return this.pageCache.get(page)!;
  }
}
