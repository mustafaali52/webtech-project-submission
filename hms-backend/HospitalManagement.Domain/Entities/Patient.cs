using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using HospitalManagement.Domain.Entities;

namespace HospitalManagement.Domain.Entities
{
    public class Patient
    {
        public int Id { get; set; }
        public required string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public required string Gender { get; set; }
        [JsonIgnore] // Prevent circular reference
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}