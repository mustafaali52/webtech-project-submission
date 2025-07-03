import { Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventTypeListComponent } from './components/event-type-list/event-type-list.component';
import { EventTypeFormComponent } from './components/event-type-form/event-type-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: EventListComponent },
  { path: 'events/new', component: EventFormComponent },
  { path: 'events/edit/:id', component: EventFormComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'event-types', component: EventTypeListComponent },
  { path: 'event-types/new', component: EventTypeFormComponent },
  { path: 'event-types/edit/:id', component: EventTypeFormComponent }
];
