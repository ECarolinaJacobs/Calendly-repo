//elena
///<summary>
/// service layer for managing event reviews
/// handles review creation, retrieval and deletion
/// validates if employee exists, event exists, no duplicate reviews per employee for the same event, rating 1-5
/// </summary>

using Microsoft.EntityFrameworkCore;
using TodoApi.Context;
using TodoApi.Models;
using TodoApi.DTOs;
using Microsoft.IdentityModel.Logging;

namespace TodoApi.Services
{
    public class ReviewService
    {
        private readonly EventContext _context;
        private readonly ProjectContext _projectContext;
        private readonly ILogger<ReviewService> _logger;
        public ReviewService(EventContext context, ProjectContext projectContext, ILogger<ReviewService> logger)
        {
            _context = context;
            _projectContext = projectContext;
            _logger = logger;
        }

        /// <summary>
        /// created new review for event and validates employee and event exist
        /// </summary>
        public async Task<(ReviewDto?, string?)> CreateReviewAsync(long eventId, CreateReviewRequest request)
        {
            _logger.LogInformation("Employee {EmployeeId} creating review for event {EventId}", request.EmployeeId, eventId);

            var eventItem = await _context.Events.FindAsync(eventId);
            if (eventItem == null)
            {
                _logger.LogWarning("Event {EventId} not found for review", eventId);
                return (null, $"Event with ID {eventId} not found.");
            }
            var employee = await _projectContext.Employees.FindAsync(request.EmployeeId);
            if (employee == null)
            {
                _logger.LogWarning("Invalid employee ID {EmployeeId} for review", request.EmployeeId);
                return (null, "Invalid employee ID.");
            }
            if (request.Rating < 1 || request.Rating > 5)
            {
                return (null, "Rating must be between 1 and 5.");
            }
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.EventId == eventId && r.EmployeeId == request.EmployeeId);

            if (existingReview != null)
            {
                return (null, "You have already reviewed this event.");
            }
            var review = new Review
            {
                Content = request.Content,
                Rating = request.Rating,
                CreatedAt = DateTime.UtcNow,
                EventId = eventId,
                EmployeeId = request.EmployeeId,
                EmployeeName = employee.Name,
                EmployeeEmail = employee.Email
            };
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Employee {EmployeeId} successfully created review {ReviewId} for event {EventId}",
            request.EmployeeId, review.Id, eventId);

            var reviewDto = new ReviewDto(
                review.Id,
                review.Content,
                review.Rating,
                review.CreatedAt,
                review.EventId,
                review.EmployeeId,
                review.EmployeeName,
                review.EmployeeEmail
            );
            return (reviewDto, null);
        }
        ///<summary>
        /// gets all reviews for a specific event
        /// </summary>
        public async Task<IEnumerable<ReviewDto>> GetReviewsByEventIdAsync(long eventId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.EventId == eventId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
            return reviews.Select(r => new ReviewDto(
                r.Id,
                r.Content,
                r.Rating,
                r.CreatedAt,
                r.EventId,
                r.EmployeeId,
                r.EmployeeName,
                r.EmployeeEmail
            ));
        }
        ///<summary>
        /// gets all reviews in the system (admin only)
        /// </summary>
        public async Task<IEnumerable<ReviewDto>> GetAllReviewsAsync()
        {
            var reviews = await _context.Reviews
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
            return reviews.Select(r => new ReviewDto(
                r.Id,
                r.Content,
                r.Rating,
                r.CreatedAt,
                r.EventId,
                r.EmployeeId,
                r.EmployeeName,
                r.EmployeeEmail
            ));
        }
        ///<summary>
        /// deletes a review (admin only)
        /// </summary>
        public async Task<bool> DeleteReviewAsync(long reviewId)
        {
            _logger.LogInformation("Deleting review {ReviewId}", reviewId);
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
            {
                _logger.LogWarning("Review {ReviewId} not found for deletion", reviewId);
                return false;
            }
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Successfully deleted review {ReviewId}", reviewId);
            return true;
        }
    }
}
