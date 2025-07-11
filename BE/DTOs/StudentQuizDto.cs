using System.ComponentModel.DataAnnotations;

namespace QUIZGAME.Dtos
{
    public class JoinQuizDto
    {
        [Required]
        public string Password { get; set; }
    }

    public class QuizDataDto
    {
        public int QuizId { get; set; }
        public string Title { get; set; }
        public int TotalQuestions { get; set; }
        public List<QuestionDataDto> Questions { get; set; }
    }

    public class QuestionDataDto
    {
        public int Id { get; set; }
        public string QuestionText { get; set; }
        public string Option1 { get; set; }
        public string Option2 { get; set; }
        public string Option3 { get; set; }
        public string Option4 { get; set; }
        // Note: CorrectOption is intentionally excluded for security
    }

    public class SubmitQuizDto
    {
        [Required]
        public int QuizId { get; set; }
        
        [Required]
        public List<AnswerDto> Answers { get; set; }
    }

    public class AnswerDto
    {
        [Required]
        public int QuestionId { get; set; }
        
        [Required]
        [Range(1, 4)]
        public int SelectedOption { get; set; }
    }

    public class QuizResultDto
    {
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public double Percentage { get; set; }
    }

    public class AttemptHistoryDto
    {
        public int Id { get; set; }
        public string QuizTitle { get; set; }
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public double Percentage { get; set; }
    }
}