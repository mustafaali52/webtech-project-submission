import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // ✅ Fixed typo from `styleUrl` to `styleUrls`
})
export class AppComponent {
  title = 'employee-management-ui';
}
