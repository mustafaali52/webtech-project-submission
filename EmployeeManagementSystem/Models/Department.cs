using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.Models
{
    public class Department
    {
        public int Id { get; set; }

        [Required, StringLength(100)]
        public required string Name { get; set; }
        public string? Description { get; set; }

        public ICollection<Employee> Employees { get; set; } = new List<Employee>();

    }
}