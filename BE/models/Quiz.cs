using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QUIZGAME.Models
{
    [Table("quizzes")]
    public class Quiz
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("title")]
        public string Title { get; set; }

        // Notice the Column attribute mapping to snake_case database column
        [Column("total_question")]
        public int TotalQuestions { get; set; }

        [Column("teacher_id")]
        public int TeacherId { get; set; }

        [ForeignKey("TeacherId")]
        public virtual Teacher Teacher { get; set; }

        [Column("password")]
        public string Password { get; set; }
    }
}
