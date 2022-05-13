import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formSubmitted = false;

  public registerForm = this.fb.group(
    {
      name: ['Khaelm253', [Validators.required, Validators.minLength(3)]],
      email: ['test123@test.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
      password2: ['123456', [Validators.required, Validators.minLength(6)]],
      terms: [false, [Validators.requiredTrue]],
    },
    {
      validators: this.samePasswords('password', 'password2'),
    }
  );

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  createUser() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    //Post
    this.userService.createUser(this.registerForm.value).subscribe(
      (response) => {
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        Swal.fire('Error', error.error.msg, 'error');
      }
    );
  }

  fieldNotValid(field: string): boolean {
    if (this.registerForm.get(field)?.invalid && this.formSubmitted) {
      return true;
    }

    return false;
  }

  passwordNotValid() {
    const pass1 = this.registerForm.get('password')!.value;
    const pass2 = this.registerForm.get('password2')!.value;

    return pass1 !== pass2 && this.formSubmitted;
  }

  acceptTerms() {
    return !this.registerForm.get('terms')!.value && this.formSubmitted;
  }

  samePasswords(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name)!;
      const pass2Control = formGroup.get(pass2Name)!;

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ notSame: true });
      }
    };
  }
}
