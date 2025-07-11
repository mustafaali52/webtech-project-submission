using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QUIZGAME.Models
{
    [Table("attempts")]
    public class Attempt
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("user_id")]
        public int UserId { get; set; }
        
        [Column("quiz_id")]
        public int QuizId { get; set; }
        
        [Column("score")]
        public int Score { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; }  // Assuming you have a User entity

        [ForeignKey("QuizId")]
        public virtual Quiz Quiz { get; set; }
    }
}
