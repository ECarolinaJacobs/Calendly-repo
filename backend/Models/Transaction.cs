using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Transaction
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int Amount { get; set; }
    public string Type { get; set; } = string.Empty; // earn, spend
    public string Reason { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Employee? Employee { get; set; }
}