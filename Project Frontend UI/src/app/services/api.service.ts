import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Event } from '../models/event.model';
import { EventType } from '../models/event-type.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // Event API calls
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${environment.apiUrl}/Events`);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${environment.apiUrl}/Events/${id}`);
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${environment.apiUrl}/Events`, event);
  }

  updateEvent(id: number, event: Event): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/Events/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Events/${id}`);
  }

  getEventsByType(eventTypeId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${environment.apiUrl}/Events/type/${eventTypeId}`);
  }

  searchEvents(eventTitle: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${environment.apiUrl}/Events/search/${eventTitle}`);
  }

  // EventType API calls
  getEventTypes(): Observable<EventType[]> {
    return this.http.get<EventType[]>(`${environment.apiUrl}/EventType`);
  }

  createEventType(eventType: EventType): Observable<EventType> {
    return this.http.post<EventType>(`${environment.apiUrl}/EventType`, eventType);
  }

  updateEventType(id: number, eventType: EventType): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/EventType/${id}`, eventType);
  }

  deleteEventType(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/EventType/${id}`);
  }

  searchEventTypeByName(name: string): Observable<EventType> {
    return this.http.get<EventType>(`${environment.apiUrl}/EventType/search/${name}`);
  }
}