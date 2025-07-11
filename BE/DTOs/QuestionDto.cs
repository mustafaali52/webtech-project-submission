namespace QUIZGAME.Dtos;

public class QuestionDto
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public string QuestionText { get; set; }
    public string Option1 { get; set; }
    public string Option2 { get; set; }
    public string Option3 { get; set; }
    public string Option4 { get; set; }
    public int CorrectOption { get; set; }
}
