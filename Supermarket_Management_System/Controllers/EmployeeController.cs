using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core.Dtos;
using SuperMarketManagement.Models;
using SuperMarketManagement.Core;

namespace SuperMarketManagement.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class EmployeeController : Controller
    {
        private readonly DataBaseContext _dataBaseContext;
        public EmployeeController(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }

        [HttpGet]
        public async Task<IEnumerable<EmployeeDto>> GetEmployees()
        {
            var employees = await _dataBaseContext.Employees.ToListAsync();
            List<EmployeeDto> employeeDtos = new List<EmployeeDto>();
            foreach (var employee in employees)
            {
                employeeDtos.Add(new EmployeeDto
                {
                    Id = employee.EmployeeID,
                    Name = employee.Name,
                    Role = employee.Role
                });
            }
            return employeeDtos;
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee(EmployeeDto employeeInfo)
        {
            var employee = new Employee
            {
                Name = employeeInfo.Name,
                Role = employeeInfo.Role
            };
            _dataBaseContext.Employees.Add(employee);
            await _dataBaseContext.SaveChangesAsync();
            return Ok(new EmployeeDto
            {
                Id = employee.EmployeeID,
                Name = employee.Name,
                Role = employee.Role
            });
        }
    }
}