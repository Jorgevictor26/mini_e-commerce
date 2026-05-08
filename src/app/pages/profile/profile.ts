import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  saved = false;
  isEditing = false;
  form: User = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    reference: ''
  };

  constructor(public auth: AuthService) {
    this.loadUser();
  }

  loadUser() {
    const user = this.auth.user();

    if (user) {
      this.form = { ...user };
    }
  }

  saveProfile() {
    this.auth.updateUser({ ...this.form });
    this.saved = true;
    this.isEditing = false;

    setTimeout(() => {
      this.saved = false;
    }, 2500);
  }

  editProfile() {
    this.loadUser();
    this.isEditing = true;
  }

  cancelEdit() {
    this.loadUser();
    this.isEditing = false;
  }
}
