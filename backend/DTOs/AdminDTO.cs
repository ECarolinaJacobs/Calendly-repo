namespace TodoApi.DTOs;
//elena
/// <summary> 
/// defines the structure of employee data sent to the frontend 
/// DTO  (data transfer object) is a safe version of the employee model because the password 
/// no longer gets directly sent to the frontend
/// 
/// dtos are object containers and are usually immutable (hence: init;)
/// 
/// relationship: 
/// - source: employee model (database structure)
/// - created by: admin controller methods -> converts employee model to employeeDto
/// - used by: frontend 
public record EmployeeDto
{
    public long Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public bool IsAdmin { get; init; }
    public int Coins { get; init; }
}
