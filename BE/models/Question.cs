using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QUIZGAME.Models
{
    [Table("questions")]
    public class Question
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("quiz_id")]
        public int QuizId { get; set; }

        [ForeignKey("QuizId")]
        public virtual Quiz Quiz { get; set; }

        [Column("question_text")]
        public string QuestionText { get; set; }

        [Column("option1")]
        public string Option1 { get; set; }

        [Column("option2")]
        public string Option2 { get; set; }

        [Column("option3")]
        public string Option3 { get; set; }

        [Column("option4")]
        public string Option4 { get; set; }

        [Column("correct_option")]
        public int CorrectOption { get; set; }
    }
}
