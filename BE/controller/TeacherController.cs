using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QUIZGAME;
using QUIZGAME.Dtos;
using QUIZGAME.Models;
using System.Security.Claims;

[ApiController]
[Route("api/teacher")]
[Authorize(Roles = "Teacher")]
public class QuizController : ControllerBase
{
    private readonly MyDataContext _context;

    public QuizController(MyDataContext context)
    {
        _context = context;
    }

    [HttpPost("quiz/create")]
    public async Task<IActionResult> CreateQuiz([FromBody] QuizDto quizDto)
    {
        try
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherIdClaim == null)
                return Unauthorized("Teacher ID not found in token.");

            if (!int.TryParse(teacherIdClaim, out var teacherId))
                return Unauthorized("Invalid Teacher ID.");

            // Create quiz entity
            var quiz = new Quiz
            {
                Title = quizDto.Title,
                Password = quizDto.Password,
                TotalQuestions = quizDto.Questions.Count,
                TeacherId = teacherId
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            // Add questions
            foreach (var q in quizDto.Questions)
            {
                var question = new Question
                {
                    QuizId = quiz.Id,
                    QuestionText = q.QuestionText,
                    Option1 = q.Option1,
                    Option2 = q.Option2,
                    Option3 = q.Option3,
                    Option4 = q.Option4,
                    CorrectOption = q.CorrectOption
                };
                _context.Questions.Add(question);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Quiz created successfully", quizId = quiz.Id });
        }
        catch (System.Exception)
        {
            throw;
        }

    }
}
