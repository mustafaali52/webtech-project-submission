namespace SuperMarketManagement.Models;

public class Employee
{
    public int EmployeeID { get; set; }
    public string Name { get; set; }
    public string Role { get; set; }
    public string Email { get; set; }

    public ICollection<Sale> Sales { get; set; }
}
