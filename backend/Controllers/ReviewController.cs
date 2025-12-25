//elena
using Microsoft.AspNetCore.Mvc;
using TodoApi.Services;
using TodoApi.DTOs;
using TodoApi.Models;
/*controller summary:
- handles all http requests from the frontend related to review operations
-public endpoints: GET reviews for an event
-authenticated endpoints: Post review (any user)
-admin endpoints: get all reviews, delete review 
*/
namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;
        private readonly ILogger<ReviewController> _logger;
        public ReviewController(ReviewService reviewService, ILogger<ReviewController> logger)
        {
            _reviewService = reviewService;
            _logger = logger;
        }
        ///<summary>
        /// creates a new review for an event (only users can make one)
        /// </summary>
        [HttpPost("event/{eventId}")]
        public async Task<ActionResult<ReviewDto>> CreateReview(long eventId, CreateReviewRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Content))
                {
                    return BadRequest(new { message = "Review content is required." });
                }
                var (reviewDto, error) = await _reviewService.CreateReviewAsync(eventId, request);
                if (error != null)
                {
                    if (error.Contains("not found"))
                        return NotFound(new { message = error });
                    if (error.Contains("Invalid"))
                        return BadRequest(new { message = error });
                    if (error.Contains("already reviewed"))
                        return Conflict(new { message = error });
                    if (error.Contains("Rating"))
                        return BadRequest(new { message = error });
                }
                _logger.LogInformation("Employee {EmployeeId} created review for event {EventId}",
                    request.EmployeeId, eventId);
                return CreatedAtAction(
                    nameof(GetReviewsByEvent),
                    new { eventId = eventId },
                    reviewDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review for event {EventId}", eventId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
        ///<summary>
        /// gets all reviews for a specific event
        /// </summary>
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByEvent(long eventId)
        {
            try
            {
                var reviews = await _reviewService.GetReviewsByEventIdAsync(eventId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving reviews for event {EventId}", eventId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
        ///<summary>
        /// gets all reviews in the system (admin only)
        /// </summary>
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetAllReviews()
        {
            try
            {
                var reviews = await _reviewService.GetAllReviewsAsync();
                _logger.LogInformation("Admin retrieved all reviews. Count: {Count}",
                    (reviews as ICollection<ReviewDto>)?.Count ?? 0);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all reviews");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
        ///<summary>
        /// deletes a review (admin only)
        /// </summary>
        [HttpDelete("{reviewId}")]
        public async Task<ActionResult> DeleteReview(long reviewId)
        {
            try
            {
                var result = await _reviewService.DeleteReviewAsync(reviewId);
                if (!result)
                {
                    return NotFound(new { message = $"Review with ID {reviewId} not found" });
                }
                _logger.LogInformation("Admin deleted review: {ReviewId}", reviewId);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting review {ReviewId}", reviewId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}