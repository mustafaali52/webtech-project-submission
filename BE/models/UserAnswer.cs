using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QUIZGAME.Models
{
    [Table("user_answer")]
    public class UserAnswer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("attempt_id")]
        public int AttemptId { get; set; }

        [ForeignKey("AttemptId")]
        public virtual Attempt Attempt { get; set; }

        [Column("question_id")]
        public int QuestionId { get; set; }

        [ForeignKey("QuestionId")]
        public virtual Question Question { get; set; }

        [Column("selected_option")]
        public int SelectedOption { get; set; }
    }
}
