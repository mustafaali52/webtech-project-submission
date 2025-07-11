using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QUIZGAME;
using QUIZGAME.Dtos;
using QUIZGAME.Models;
using System.Security.Claims;

[ApiController]
[Route("api/student")]
[Authorize(Roles = "Student")]
public class StudentQuizController : ControllerBase
{
    private readonly MyDataContext _context;

    public StudentQuizController(MyDataContext context)
    {
        _context = context;
    }

    [HttpPost("quiz/join")]
    public async Task<IActionResult> JoinQuiz([FromBody] JoinQuizDto joinQuizDto)
    {
        try
        {
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (studentIdClaim == null)
                return Unauthorized("Student ID not found in token.");

            if (!int.TryParse(studentIdClaim, out var studentId))
                return Unauthorized("Invalid Student ID.");

            // Find quiz by password
            var quiz = await _context.Quizzes
                .FirstOrDefaultAsync(q => q.Password == joinQuizDto.Password);

            if (quiz == null)
                return NotFound("Quiz not found with the provided password.");

            // Check if student has already attempted this quiz
            var existingAttempt = await _context.Attempts
                .FirstOrDefaultAsync(a => a.UserId == studentId && a.QuizId == quiz.Id);

            if (existingAttempt != null)
                return BadRequest("You have already attempted this quiz.");

            // Get questions for this quiz
            var questions = await _context.Questions
                .Where(q => q.QuizId == quiz.Id)
                .ToListAsync();

            // Prepare quiz data without correct answers
            var quizData = new QuizDataDto
            {
                QuizId = quiz.Id,
                Title = quiz.Title,
                TotalQuestions = quiz.TotalQuestions,
                Questions = questions.Select(q => new QuestionDataDto
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    Option1 = q.Option1,
                    Option2 = q.Option2,
                    Option3 = q.Option3,
                    Option4 = q.Option4
                }).ToList()
            };

            return Ok(quizData);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while joining the quiz.", error = ex.Message });
        }
    }

    [HttpPost("quiz/submit")]
    public async Task<IActionResult> SubmitQuiz([FromBody] SubmitQuizDto submitQuizDto)
    {
        try
        {
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (studentIdClaim == null)
                return Unauthorized("Student ID not found in token.");

            if (!int.TryParse(studentIdClaim, out var studentId))
                return Unauthorized("Invalid Student ID.");

            // Verify quiz exists
            var quiz = await _context.Quizzes
                .FirstOrDefaultAsync(q => q.Id == submitQuizDto.QuizId);

            if (quiz == null)
                return NotFound("Quiz not found.");

            // Check if student has already attempted this quiz
            var existingAttempt = await _context.Attempts
                .FirstOrDefaultAsync(a => a.UserId == studentId && a.QuizId == submitQuizDto.QuizId);

            if (existingAttempt != null)
                return BadRequest("You have already attempted this quiz.");

            // Get questions for this quiz
            var questions = await _context.Questions
                .Where(q => q.QuizId == submitQuizDto.QuizId)
                .ToListAsync();

            // Calculate score
            int score = 0;
            var questionAnswers = submitQuizDto.Answers.ToDictionary(a => a.QuestionId, a => a.SelectedOption);

            foreach (var question in questions)
            {
                if (questionAnswers.ContainsKey(question.Id))
                {
                    if (questionAnswers[question.Id] == question.CorrectOption)
                    {
                        score++;
                    }
                }
            }

            // Save attempt to database
            var attempt = new Attempt
            {
                UserId = studentId,
                QuizId = submitQuizDto.QuizId,
                Score = score
            };

            _context.Attempts.Add(attempt);
            await _context.SaveChangesAsync();

            // Return result
            var result = new QuizResultDto
            {
                Score = score,
                TotalQuestions = quiz.TotalQuestions,
                Percentage = Math.Round((double)score / quiz.TotalQuestions * 100, 2)
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while submitting the quiz.", error = ex.Message });
        }
    }

    [HttpGet("quiz/attempts")]
    public async Task<IActionResult> GetMyAttempts()
    {
        try
        {
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (studentIdClaim == null)
                return Unauthorized("Student ID not found in token.");

            if (!int.TryParse(studentIdClaim, out var studentId))
                return Unauthorized("Invalid Student ID.");

            var attempts = await _context.Attempts
                .Include(a => a.Quiz)
                .Where(a => a.UserId == studentId)
                .Select(a => new AttemptHistoryDto
                {
                    Id = a.Id,
                    QuizTitle = a.Quiz.Title,
                    Score = a.Score,
                    TotalQuestions = a.Quiz.TotalQuestions,
                    Percentage = Math.Round((double)a.Score / a.Quiz.TotalQuestions * 100, 2)
                })
                .ToListAsync();

            return Ok(attempts);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching attempts.", error = ex.Message });
        }
    }
}