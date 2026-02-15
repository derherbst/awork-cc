import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserItemComponent } from './user-item.component';
import { MockResult } from '../../mock-data';
import { User } from '../../models/user.model';
import { UserResult } from '../../models/api-result.model';

describe('UserItemComponent', () => {
  let component: UserItemComponent;
  let fixture: ComponentFixture<UserItemComponent>;

  const mockedUsers = User.mapFromUserResult(
    MockResult.results as UserResult[],
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserItemComponent);
    fixture.componentRef.setInput('user', mockedUsers[0]);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be expanded by default', () => {
    expect(component.expanded).toBeFalse();
  });

  it('should toggle expanded on click', () => {
    component.toggleExpand();
    expect(component.expanded).toBeTrue();

    component.toggleExpand();
    expect(component.expanded).toBeFalse();
  });

  it('should display user name', () => {
    const el: HTMLElement = fixture.nativeElement;
    const name = el.querySelector('.user-item__name')?.textContent?.trim();
    expect(name).toContain(mockedUsers[0].firstname);
    expect(name).toContain(mockedUsers[0].lastname);
  });

  it('should show details when expanded', () => {
    const el: HTMLElement = fixture.nativeElement;
    el.querySelector<HTMLElement>('.user-item')!.click();
    fixture.detectChanges();

    const details = el.querySelector('.user-item__details');
    expect(details).toBeTruthy();
  });

  it('should hide details when collapsed', () => {
    const el: HTMLElement = fixture.nativeElement;
    const details = el.querySelector('.user-item__details');
    expect(details).toBeNull();
  });
});
