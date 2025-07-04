import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule

import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';

@NgModule({
  declarations: [
    AppointmentFormComponent,
    AppointmentListComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // ✅ Add here
    AppointmentRoutingModule
  ]
})
export class AppointmentModule { }
