import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { SearchsService } from '../../../services/searchs.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
})
export class UsersComponent implements OnInit {
  public totalUsers: number = 0;

  public users: User[] = [];

  public since: number = 0;

  public loading: boolean = false;

  constructor(
    private userService: UserService,
    private searchService: SearchsService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;

    this.userService.loadUsers(this.since).subscribe(({ total, users }) => {
      this.totalUsers = total;

      this.users = users;

      this.loading = false;
    });
  }

  changePage(value: number) {
    this.since += value;

    if (this.since < 0) {
      this.since = 0;
    } else if (this.since > this.totalUsers) {
      this.since -= value;
    }

    this.loadUsers();
  }

  search(term: string) {
    if (term.length < 1) {
      return;
    }

    this.loading = true;

    this.searchService.search('users', term).subscribe((response: any) => {
      console.log(response);
    });
  }
}
