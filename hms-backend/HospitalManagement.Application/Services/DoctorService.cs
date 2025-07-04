using HospitalManagement.Domain.Interfaces;
using HospitalManagement.Application.Interfaces;
using HospitalManagement.Domain.Entities;
using HospitalManagement.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.Application.Services
{
    public class DoctorService : Application.Interfaces.IDoctorService
    {
        private readonly IApplicationDbContext _context;

        public DoctorService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Doctor>> GetAllDoctorsAsync()
        {
            return await _context.Doctors.ToListAsync();
        }

        public async Task<Doctor> GetDoctorByIdAsync(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            return doctor ?? throw new EntityNotFoundException(nameof(Doctor), id);
        }

        public async Task<Doctor> CreateDoctorAsync(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
            return doctor;
        }

        public async Task UpdateDoctorAsync(Doctor doctor)
        {
            var existingDoctor = await GetDoctorByIdAsync(doctor.Id);
            _context.Doctors.Entry(existingDoctor).CurrentValues.SetValues(doctor);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDoctorAsync(int id)
        {
            var doctor = await GetDoctorByIdAsync(id);
            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
        }
    }
}