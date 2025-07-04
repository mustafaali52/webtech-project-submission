using HospitalManagement.Domain.Interfaces;
using HospitalManagement.Domain.Entities;
using HospitalManagement.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Application.Services
{
    public class AppointmentService : Application.Interfaces.IAppointmentService
    {
        private readonly IApplicationDbContext _context;
        private const int AppointmentDurationMinutes = 30; // Standard appointment duration

        public AppointmentService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();
        }

        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == id);

            return appointment ?? throw new EntityNotFoundException(nameof(Appointment), id);
        }

        public async Task<Appointment> CreateAppointmentAsync(Appointment appointment)
        {
            await ValidateAppointmentAsync(appointment);

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task UpdateAppointmentAsync(Appointment appointment)
        {
            var existingAppointment = await GetAppointmentByIdAsync(appointment.Id);
            
            // Don't validate if the appointment date hasn't changed
            if (existingAppointment.AppointmentDate != appointment.AppointmentDate ||
                existingAppointment.DoctorId != appointment.DoctorId)
            {
                await ValidateAppointmentAsync(appointment);
            }

            _context.Appointments.Entry(existingAppointment).CurrentValues.SetValues(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            var appointment = await GetAppointmentByIdAsync(id);
            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Appointment>> GetDoctorAppointmentsAsync(int doctorId, DateTime? date = null)
        {
            var query = _context.Appointments
                .Include(a => a.Patient)
                .Where(a => a.DoctorId == doctorId);

            if (date.HasValue)
            {
                query = query.Where(a => a.AppointmentDate.Date == date.Value.Date);
            }

            return await query.OrderBy(a => a.AppointmentDate).ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetPatientAppointmentsAsync(int patientId)
        {
            return await _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.PatientId == patientId)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetTodayAppointmentsAsync()
        {
            var today = DateTime.Today;
            return await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .Where(a => a.AppointmentDate.Date == today)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<DateTime>> GetAvailableSlotsAsync(int doctorId, DateTime date)
        {
            // Validate doctor exists
            var doctor = await _context.Doctors.FindAsync(doctorId)
                ?? throw new EntityNotFoundException(nameof(Doctor), doctorId);

            // Get all appointments for the doctor on the specified date
            var existingAppointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.AppointmentDate.Date == date.Date)
                .Select(a => a.AppointmentDate)
                .ToListAsync();

            // Generate all possible slots
            var slots = new List<DateTime>();
            var startTime = new TimeSpan(9, 0, 0); // 9 AM
            var endTime = new TimeSpan(17, 0, 0);  // 5 PM
            var slotDuration = TimeSpan.FromMinutes(30);

            for (var time = startTime; time < endTime; time += slotDuration)
            {
                var slotDateTime = date.Date + time;
                if (!existingAppointments.Any(a => a == slotDateTime))
                {
                    slots.Add(slotDateTime);
                }
            }

            return slots;
        }

        private async Task ValidateAppointmentAsync(Appointment appointment)
        {
            // Check if doctor exists
            var doctor = await _context.Doctors.FindAsync(appointment.DoctorId)
                ?? throw new EntityNotFoundException(nameof(Doctor), appointment.DoctorId);

            // Check if patient exists
            var patient = await _context.Patients.FindAsync(appointment.PatientId)
                ?? throw new EntityNotFoundException(nameof(Patient), appointment.PatientId);

            // Validate appointment date
            ValidateAppointmentDate(appointment.AppointmentDate);

            // Check for overlapping appointments
            await ValidateNoOverlappingAppointments(appointment);
        }

        private void ValidateAppointmentDate(DateTime appointmentDate)
        {
            if (appointmentDate <= DateTime.Now)
            {
                throw new InvalidOperationException("Appointment must be scheduled for a future date.");
            }

            if (appointmentDate.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday)
            {
                throw new InvalidOperationException("Appointments cannot be scheduled on weekends.");
            }

            var appointmentTime = appointmentDate.TimeOfDay;
            var startTime = new TimeSpan(9, 0, 0); // 9 AM
            var endTime = new TimeSpan(17, 0, 0);  // 5 PM

            if (appointmentTime < startTime || appointmentTime > endTime)
            {
                throw new InvalidOperationException("Appointments must be scheduled between 9 AM and 5 PM.");
            }
        }

        private async Task ValidateNoOverlappingAppointments(Appointment appointment)
        {
            var appointmentEndTime = appointment.AppointmentDate.AddMinutes(AppointmentDurationMinutes);

            var overlappingAppointment = await _context.Appointments
                .Where(a => a.DoctorId == appointment.DoctorId
                    && a.Id != appointment.Id // Exclude current appointment when updating
                    && ((a.AppointmentDate <= appointment.AppointmentDate && a.AppointmentDate.AddMinutes(AppointmentDurationMinutes) > appointment.AppointmentDate)
                    || (a.AppointmentDate < appointmentEndTime && a.AppointmentDate.AddMinutes(AppointmentDurationMinutes) >= appointmentEndTime)))
                .FirstOrDefaultAsync();

            if (overlappingAppointment != null)
            {
                throw new InvalidOperationException($"Doctor has another appointment scheduled at {overlappingAppointment.AppointmentDate}");
            }
        }
    }
}