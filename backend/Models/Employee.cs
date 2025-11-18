namespace TodoApi.Models;

public class Employee
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public int Coins { get; set; }
    public bool IsAdmin { get; set; }
}