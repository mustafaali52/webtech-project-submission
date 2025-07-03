import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventComponent } from './components/event/event.component';
import { NavbarComponent } from './components/navbar/navbar.component'; // Import NavbarComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, EventComponent, NavbarComponent], // Add NavbarComponent to imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project-fe';
}