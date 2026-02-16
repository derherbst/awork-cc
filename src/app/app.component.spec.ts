import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { UsersService } from './services/users.service';
import { UsersServiceStub } from './services/users.service.stub';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: UsersService,
          useClass: UsersServiceStub,
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have nationality as default criterion', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.activeCriterion()).toBe('nationality');
  });

  it('should have empty search term by default', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.searchTerm()).toBe('');
  });

  it('should switch criterion', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.switchCriterion('age');
    expect(app.activeCriterion()).toBe('age');
  });

  it('should update searchTerm after debounce on search', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const event = { target: { value: 'Smi' } } as unknown as Event;
    app.onSearch(event);

    expect(app.searchTerm()).toBe('');

    tick(200);

    expect(app.searchTerm()).toBe('smi');
  }));
});
