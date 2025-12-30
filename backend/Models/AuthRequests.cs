namespace TodoApi.Models
{
    public record RegisterRequest(string Name, string Email, string Password);
    public record LoginRequest(string Email, string Password);
}