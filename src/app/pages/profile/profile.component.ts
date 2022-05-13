import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent implements OnInit {
  public profileForm!: FormGroup;
  public user: User;
  public image!: File;
  public imgTemp: any = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private fileUploadService: FileUploadService
  ) {
    this.user = userService.user;
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
    });
  }

  updateProfile() {
    this.userService.updateProfile(this.profileForm.value).subscribe(
      () => {
        const { nombre, email } = this.profileForm.value;
        this.user.name = nombre;
        this.user.email = email;

        Swal.fire('Saved', 'Changes saved succesfully', 'success');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  changeImageContainer(event: any) {
    if (!event.target.files[0]) {
      return;
    }
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };

    this.image = event.target.files[0];
  }

  addImage() {
    this.fileUploadService
      .updateImage(this.image, 'users', this.user.id!)
      .then((img) => {
        this.user.img = img;
        Swal.fire('Image saved', 'Image updated succesfully', 'success');
      })
      .catch((err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }
}
