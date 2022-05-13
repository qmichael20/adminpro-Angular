import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.renderButton();
  }

  public auth2: any;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  login() {
    this.userService.loginUser(this.loginForm.value).subscribe({
      next: (response) => {
        if (this.loginForm.get('remember')!.value) {
          localStorage.setItem('email', this.loginForm.get('email')!.value);
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        Swal.fire('Error', error.error.msg, 'error');
      },
    });
  }

  // const id_token = googleUser.getAuthResponse().id_token;

  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
    });

    this.startApp();
  }

  async startApp() {
    await this.userService.googleInit();

    this.auth2 = this.userService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element: any) {
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser: any) => {
        const id_token = googleUser.getAuthResponse().id_token;

        this.userService.loginUserGoogle(id_token).subscribe((response) => {
          this.ngZone.run(() => {
            this.router.navigate(['/dashboard']);
          });
        });
      },
      (error: any) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
}
