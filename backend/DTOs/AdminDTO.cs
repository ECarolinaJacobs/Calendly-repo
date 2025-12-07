namespace TodoApi.DTOs;

// data transfer object (DTO) for employee information
public record EmployeeDto
{
    public long Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public bool IsAdmin { get; init; }
    public int Coins { get; init; }
    // no password field for security purposes
}