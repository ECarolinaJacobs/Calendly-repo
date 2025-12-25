//elena
namespace TodoApi.DTOs
{
    ///<summary>
    /// DTO for creating a review used for submitting reviews for an event
    /// </summary>
    public record CreateReviewRequest(
        long EmployeeId,
        string Content,
        int Rating
    );
    ///<summary>
    /// DTO for review data to be sent to frontend: contains all review info
    /// </summary>
    public record ReviewDto(
        long Id,
        string Content,
        int Rating,
        DateTime CreatedAt,
        long EventId,
        long EmployeeId,
        string EmployeeName,
        string EmployeeEmail
    );
}
