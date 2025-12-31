namespace TodoApi.DTOs;
//elena
/// <summary>
/// Statistics for admin dashboard
/// </summary>
public record AdminStatsDto
{
    public int TotalEmployees { get; init; }
    public int TotalAdmins { get; init; }
    public int TotalRegularUsers { get; init; }
    public int TotalCoins { get; init; }
    public double AverageCoinsPerUser { get; init; }
}