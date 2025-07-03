import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | undefined;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.apiService.getEventById(+id).subscribe(event => {
          this.event = event;
        });
      }
    });
  }

  editEvent(): void {
    if (this.event) {
      this.router.navigate(['/events/edit', this.event.eventId]);
    }
  }

  deleteEvent(): void {
    if (this.event && confirm('Are you sure you want to delete this event?')) {
      this.apiService.deleteEvent(this.event.eventId).subscribe(() => {
        this.router.navigate(['/events']); // Navigate back to list after deletion
      });
    }
  }
}