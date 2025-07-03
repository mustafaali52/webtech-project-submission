import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private apiService: ApiService) { }

  getEvents(): Observable<Event[]> {
    return this.apiService.getEvents();
  }
}
