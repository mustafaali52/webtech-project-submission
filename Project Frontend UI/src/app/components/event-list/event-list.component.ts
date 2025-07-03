import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule] // Add RouterModule and FormsModule
})
export class EventListComponent implements OnInit {

  events: Event[] = [];
  searchTerm: string = '';
  filterTypeId: number | null = null;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.apiService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/events', id]);
  }

  editEvent(id: number): void {
    this.router.navigate(['/events/edit', id]);
  }

  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.apiService.deleteEvent(id).subscribe(() => {
        this.loadEvents(); // Reload events after deletion
      });
    }
  }

  addEvent(): void {
    this.router.navigate(['/events/new']);
  }

  searchEvents(): void {
    if (this.searchTerm) {
      this.apiService.searchEvents(this.searchTerm).subscribe(events => {
        this.events = events;
      });
    } else {
      this.loadEvents(); // If search term is empty, load all events
    }
  }

  filterEvents(): void {
    if (this.filterTypeId) {
      this.apiService.getEventsByType(this.filterTypeId).subscribe(events => {
        this.events = events;
      });
    } else {
      this.loadEvents(); // If filter is empty, load all events
    }
  }
}