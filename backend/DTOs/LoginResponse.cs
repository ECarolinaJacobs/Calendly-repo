namespace TodoApi.DTOs;

public record LoginResponse
{
    public string Token { get; init; }
    public long Id { get; init; }
    public string Name { get; init; }
    public string Email { get; init; }
    // Removed due to safety concerns
    // public bool IsAdmin { get; init; }
}