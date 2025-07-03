import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { EventType } from '../../models/event-type.model';

@Component({
  selector: 'app-event-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-type-form.component.html',
  styleUrls: ['./event-type-form.component.css']
})
export class EventTypeFormComponent implements OnInit {
  eventTypeForm!: FormGroup;
  isEditMode: boolean = false;
  eventTypeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.eventTypeForm = this.fb.group({
      typeName: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.eventTypeId = +id;
        // Note: Your backend EventTypeController does not have a GET by ID endpoint.
        // For editing, we'll assume the form is pre-filled or you'll need to add that endpoint.
        // For now, we'll just set the typeName if it's an edit, but won't fetch from API.
        // If you add a GET by ID endpoint, you would call apiService.getEventTypeById(this.eventTypeId)
        // and then patch the form value.
        // For demonstration, I'll just set a placeholder if in edit mode.
        // In a real app, you'd fetch the existing data.
        // For now, we'll rely on the user to input the correct typeName for editing.
        // If you implement a GET by ID, uncomment the following:
        /*
        this.apiService.getEventTypeById(this.eventTypeId).subscribe(eventType => {
          this.eventTypeForm.patchValue(eventType);
        });
        */
      }
    });
  }

  onSubmit(): void {
    if (this.eventTypeForm.valid) {
      const eventTypeData: EventType = this.eventTypeForm.value;
      if (this.isEditMode && this.eventTypeId) {
        // Backend PUT expects typeId in the URL, and typeName in the body.
        // The DTO only has typeName, so we'll pass that.
        this.apiService.updateEventType(this.eventTypeId, eventTypeData).subscribe(() => {
          this.router.navigate(['/event-types']);
        });
      } else {
        this.apiService.createEventType(eventTypeData).subscribe(() => {
          this.router.navigate(['/event-types']);
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/event-types']);
  }
}