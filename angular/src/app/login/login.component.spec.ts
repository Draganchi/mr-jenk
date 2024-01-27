import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../service/user.service';
import { NavigationExtras, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: UserService,
          useValue: {
            sendLoginRequest: () =>
              of({
                id: '123123123123',
                email: 'test@test.com',
                jwtToken:
                  'ajsdklajsdlskldjaskdjalksdjlaksjdlkasjdlkajsdlslkajsd',
                name: 'ali',
                role: 'ROLE_CLIENT',
              }),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getAuth: () => {
              of({
                name: 'ali',
                email: 'ali@ali.com',
                id: '123123123123123',
                role: 'SELLER',
              });
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to register page', () => {
    const router = TestBed.inject(Router);

    component.goToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });

  it('should initialize variables', () => {
    expect(component.formValid).toBeFalse();
  });

  it('should validate correct form', () => {
    component.loginForm.setValue({
      name: 'ali',
      password: 'test123',
    });
    component.onValidate();

    expect(component.formValid).toBeTrue();
  });

  it('should not validate form: long name', () => {
    component.loginForm.setValue({
      name:
        'ttalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdanelialiokok123123123kasdkaskdkasdtalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdanelialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdanelialiokok123123123kasdkaskdkasd',
      password: 'asdasd',
    });
    component.onValidate();

    expect(component.formValid).toBeFalse();
  });

  it('should not validate form: long password', () => {
    component.loginForm.setValue({
      password:
        'ttalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdanelialiokok123123123kasdkaskdkasdtalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdanelialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdalialiokok123123123kasdkaskdkasdanelialiokok123123123kasdkaskdkasd',
      name: 'asdasd',
    });
    component.onValidate();

    expect(component.formValid).toBeFalse();
  });

  it('should not validate form: no name', () => {
    component.loginForm.setValue({
      name: ' ',
      password: 'test123',
    });
    component.onValidate();

    expect(component.formValid).toBeFalse();
  });

  it('should not validate form: no password', () => {
    component.loginForm.setValue({
      name: ' ',
      password: 'asdasd',
    });
    component.onValidate();

    expect(component.formValid).toBeFalse();
  });

  it('should call onSubmit and navigate to home page on succesfull login', () => {
    const userService = TestBed.inject(UserService);
    const router = TestBed.inject(Router);

    spyOn(userService, 'sendLoginRequest').and.returnValue(
      of({
        id: '123123123123',
        email: 'test@test.com',
        jwtToken: 'ajsdklajsdlskldjaskdjalksdjlaksjdlkasjdlkajsdlslkajsd',
        name: 'ali',
        role: 'ROLE_CLIENT',
      }),
    );

    component.loginForm.setValue({
      name: 'testuser',
      password: 'testpassword',
    });
    component.onSubmit();

    expect(userService.sendLoginRequest).toHaveBeenCalledWith({
      name: 'testuser',
      password: 'testpassword',
    });

    const navigationExtras: NavigationExtras = {
      state: {
        data: {
          id: '123123123123',
          email: 'test@test.com',
          jwtToken: 'ajsdklajsdlskldjaskdjalksdjlaksjdlkasjdlkajsdlslkajsd',
          name: 'ali',
          role: 'ROLE_CLIENT',
        },
      },
    };
    expect(router.navigate).toHaveBeenCalledWith(['home'], navigationExtras);
  });
});
