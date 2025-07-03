import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventType } from '../../models/event-type.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-event-type-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './event-type-list.component.html',
  styleUrls: ['./event-type-list.component.css']
})
export class EventTypeListComponent implements OnInit {

  eventTypes: EventType[] = [];
  searchTerm: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadEventTypes();
  }

  loadEventTypes(): void {
    this.apiService.getEventTypes().subscribe(eventTypes => {
      this.eventTypes = eventTypes;
    });
  }

  addEventType(): void {
    this.router.navigate(['/event-types/new']);
  }

  editEventType(id: number): void {
    this.router.navigate(['/event-types/edit', id]);
  }

  deleteEventType(id: number): void {
    if (confirm('Are you sure you want to delete this event type?')) {
      this.apiService.deleteEventType(id).subscribe(() => {
        this.loadEventTypes(); // Reload event types after deletion
      });
    }
  }

  searchEventTypes(): void {
    if (this.searchTerm) {
      this.apiService.searchEventTypeByName(this.searchTerm).subscribe(eventType => {
        // The backend search returns a single EventType, so we need to handle that.
        // If it's an array, we'd assign it directly.
        // For now, assuming it returns a single object or null/undefined.
        this.eventTypes = eventType ? [eventType] : [];
      });
    } else {
      this.loadEventTypes(); // If search term is empty, load all event types
    }
  }
}