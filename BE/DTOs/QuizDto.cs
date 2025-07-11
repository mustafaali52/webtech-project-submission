namespace QUIZGAME.Dtos;

public class QuizDto
{
    public string Title { get; set; }
    public string Password { get; set; }
    public List<QuestionDto> Questions { get; set; }
}

