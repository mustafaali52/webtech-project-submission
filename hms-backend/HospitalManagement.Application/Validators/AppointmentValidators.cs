using FluentValidation;
using HospitalManagement.Application.DTOs;

namespace HospitalManagement.Application.Validators
{
    public class CreateAppointmentDtoValidator : AbstractValidator<CreateAppointmentDto>
    {
        public CreateAppointmentDtoValidator()
        {
            RuleFor(x => x.AppointmentDate)
                .NotEmpty()
                .GreaterThan(DateTime.Now)
                .WithMessage("Appointment date must be in the future");

            RuleFor(x => x.PatientId)
                .GreaterThan(0)
                .WithMessage("Valid patient ID is required");

            RuleFor(x => x.DoctorId)
                .GreaterThan(0)
                .WithMessage("Valid doctor ID is required");
        }
    }

    public class UpdateAppointmentDtoValidator : AbstractValidator<UpdateAppointmentDto>
    {
        public UpdateAppointmentDtoValidator()
        {
            RuleFor(x => x.AppointmentDate)
                .NotEmpty()
                .GreaterThan(DateTime.Now)
                .WithMessage("Appointment date must be in the future");

            RuleFor(x => x.PatientId)
                .GreaterThan(0)
                .WithMessage("Valid patient ID is required");

            RuleFor(x => x.DoctorId)
                .GreaterThan(0)
                .WithMessage("Valid doctor ID is required");
        }
    }
}