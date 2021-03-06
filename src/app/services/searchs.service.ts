import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { User } from '../models/user.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SearchsService {
  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): any {
    return {
      'x-token': this.token,
    };
  }

  private transformUser(results: any[]): User[] {
    return results.map(
      user => {
        const { name, email, img = '', role, google, id } = user;

        return new User(name, email, '', google, img, role, id);
      }
    )

  }

  search(type: 'users' | 'hospitals' | 'doctors', term: string = '') {
    const url = `${base_url}/collection/${type}/${term}`;

    return this.http
      .get<any[]>(url, { headers: this.headers })
      .pipe(map((response: any) => {
        switch (type) {
          case 'users':
            return this.transformUser(response.results);
        }
      }));
  }
}
