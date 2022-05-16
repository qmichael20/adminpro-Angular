import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';

import { RegisterForm } from '../interfaces/register-form.interfaces';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { tap, map, Observable, catchError, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LoadUser } from '../interfaces/load-users.interfaces';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public auth2: any;

  public user!: User;

  private userSubject = new Subject<User>();

  userObservable = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get userId(): string {
    return this.user.id || '';
  }

  get headers(): any {
    return {
      'x-token': this.token,
    };
  }

  createUser(formData: RegisterForm) {
    const url = `${base_url}/users`;

    return this.http.post(url, formData).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  loginUser(formData: LoginForm) {
    const url = `${base_url}/auth/login`;

    return this.http.post(url, formData).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  logoutUser() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  loginUserGoogle(token: string) {
    const url = `${base_url}/auth/login/google`;

    return this.http.post(url, { token }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  googleInit() {
    return new Promise<void>((resolve) => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id:
            '637938694147-gmnnklkjh2e1kusg6k6devqh7pn1cqj2.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });
  }

  updateProfile(data: { email: string; name: string; role: string }) {
    data = {
      ...data,
      role: this.user.role!,
    };

    const url = `${base_url}/users/${this.userId}`;

    return this.http.put(url, data, { headers: this.headers }).pipe(
      tap((response: any) => {
        this.dataUser(response.user);
      })
    );
  }

  dataUser(user: User) {
    const { name, email, img = '', role, google, id } = user;

    this.user = new User(name, email, '', google, img, role, id);

    this.userSubject.next(this.user);
  }

  tokenValidor(): Observable<boolean> {
    const url = `${base_url}/auth/renew`;

    return this.http.get(url, { headers: this.headers }).pipe(
      map((response: any) => {
        const { name, email, img = '', role, google, id } = response.user;

        this.user = new User(name, email, '', google, img, role, id);

        localStorage.setItem('token', response.token);

        return true;
      }),
      catchError((error) => of(false))
    );
  }

  loadUsers(since: number = 0): Observable<LoadUser> {
    const url = `${base_url}/users?since=${since}`;

    return this.http.get<LoadUser>(url, { headers: this.headers }).pipe(
      map((response: LoadUser) => {
        const users = response.users.map(
          (user) =>
            new User(
              user.name,
              user.email,
              '',
              user.google,
              user.img,
              user.role,
              user.id
            )
        );

        return {
          total: response.total,
          users,
        };
      })
    );
  }

  deleteUser(user: User) {
    const url = `${base_url}/users/${user.id}`;

    return this.http.delete(url, { headers: this.headers });
  }

  saveUser(user: User) {

    const url = `${base_url}/users/${user.id}`;

    return this.http.put(url, user, { headers: this.headers })

  }
}
