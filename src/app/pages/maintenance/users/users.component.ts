import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { SearchsService } from '../../../services/searchs.service';
import Swal from 'sweetalert2';
import { ModalImageService } from '../../../services/modal-image.service';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
})
export class UsersComponent implements OnInit, OnDestroy {
  public totalUsers: number = 0;

  public users: User[] = [];

  public usersTemp: User[] = []

  public since: number = 0;

  public loading: boolean = false;

  public imgSub: Subscription;

  constructor(
    private userService: UserService,
    private searchService: SearchsService,
    private modalService: ModalImageService
  ) { }

  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  ngOnInit(): void {
    this.loadUsers();

    this.imgSub = this.modalService.newImage.pipe(delay(100)).subscribe(img => this.loadUsers())
  }

  loadUsers() {
    this.loading = true;

    this.userService.loadUsers(this.since).subscribe(({ total, users }) => {
      this.totalUsers = total;

      this.users = users;

      this.usersTemp = users;

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
    if (term.length === 0) {
      return this.users = this.usersTemp;
    }

    this.loading = true;

    this.searchService.search('users', term).subscribe((response: any) => {

      this.users = [...response]
    });

    this.loading = false;
  }

  deleteUser(user: User) {

    if (user.id === this.userService.user.id) {
      return Swal.fire('Error', "You can't delete your own user", 'error');
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You will delete the ${user.name} user and can't revert this action!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete this user!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.userService.deleteUser(user).subscribe(resp => {
          Swal.fire(
            'User Deleted!',
            `${user.name} has been deleted.`,
            'success'
          );

          this.loadUsers();
        })



      }
    })
  }

  changeRole(user: User) {
    this.userService.saveUser(user).subscribe(resp => {
      console.log(resp);

    })
  }

  openModal(user: User) {
    this.modalService.openModal('users', user.id, user.getImg);
  }
}
