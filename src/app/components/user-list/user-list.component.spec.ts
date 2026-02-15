import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { MockResult } from '../../mock-data';
import { User } from '../../models/user.model';
import { UserResult } from '../../models/api-result.model';
import { ListRow } from '../../services/grouping.service';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  const mockedUsers = User.mapFromUserResult(
    MockResult.results as UserResult[],
  );

  const mockRows: ListRow[] = [
    { type: 'header', name: 'US', count: 2, expanded: true },
    { type: 'column-header' },
    { type: 'user', user: mockedUsers[0] },
    { type: 'user', user: mockedUsers[1] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    fixture.componentRef.setInput('rows', mockRows);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit headerToggle when group header is clicked', () => {
    spyOn(component.headerToggle, 'emit');
    component.onHeaderClick('US');
    expect(component.headerToggle.emit).toHaveBeenCalledWith('US');
  });

  it('should default criterion to nationality', () => {
    expect(component.criterion()).toBe('nationality');
  });
});
