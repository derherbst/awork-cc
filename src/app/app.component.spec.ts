import { TestBed } from '@angular/core/testing';
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
});
