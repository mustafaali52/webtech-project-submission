import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './shared/services/token.service';
import { RouterModule } from '@angular/router'; // <-- Add this import

@Component({
  selector: 'app-root',
  standalone: true, // <-- Make sure this is present
  imports: [RouterModule], // <-- Add RouterModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quiz-game';

  constructor(private tokenService: TokenService, private router: Router) {}

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['login']);
  }
}
