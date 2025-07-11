namespace QUIZGAME.Dtos;

public class UserAnswerDto
{
    public int Id { get; set; }
    public int AttemptId { get; set; }
    public int QuestionId { get; set; }
    public int SelectedOption { get; set; }
}
