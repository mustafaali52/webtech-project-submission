import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  isEditMode: boolean = false;
  eventId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      eventTitle: ['', Validators.required],
      eventTypeId: [null, Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      organizerId: [null, Validators.required],
      locationId: [null, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.eventId = +id;
        this.apiService.getEventById(this.eventId).subscribe(event => {
          this.eventForm.patchValue(event);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const eventData: Event = this.eventForm.value;
      if (this.isEditMode && this.eventId) {
        this.apiService.updateEvent(this.eventId, eventData).subscribe(() => {
          this.router.navigate(['/events']);
        });
      } else {
        this.apiService.createEvent(eventData).subscribe(() => {
          this.router.navigate(['/events']);
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/events']);
  }
}
