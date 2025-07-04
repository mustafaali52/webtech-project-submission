using FluentValidation;
using HospitalManagement.Application.DTOs;

namespace HospitalManagement.Application.Validators
{
    public class CreatePatientDtoValidator : AbstractValidator<CreatePatientDto>
    {
        public CreatePatientDtoValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty()
                .MaximumLength(100)
                .WithMessage("Full name is required and cannot exceed 100 characters");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .LessThan(DateTime.Now)
                .WithMessage("Date of birth must be in the past");

            RuleFor(x => x.Gender)
                .NotEmpty()
                .MaximumLength(20)
                .WithMessage("Gender is required and cannot exceed 20 characters");
        }
    }

    public class UpdatePatientDtoValidator : AbstractValidator<UpdatePatientDto>
    {
        public UpdatePatientDtoValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty()
                .MaximumLength(100)
                .WithMessage("Full name is required and cannot exceed 100 characters");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .LessThan(DateTime.Now)
                .WithMessage("Date of birth must be in the past");

            RuleFor(x => x.Gender)
                .NotEmpty()
                .MaximumLength(20)
                .WithMessage("Gender is required and cannot exceed 20 characters");
        }
    }
}