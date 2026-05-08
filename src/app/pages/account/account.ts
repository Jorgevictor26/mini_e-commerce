import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {
  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  login(event?: Event) {
    event?.preventDefault();
    this.auth.login();
    const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/conta';
    this.router.navigateByUrl(redirect);
  }

  logout() {
    this.auth.logout();
  }
}
