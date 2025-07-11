using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizGame.Migrations
{
    /// <inheritdoc />
    public partial class addrelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_user_answer_attempt_id",
                table: "user_answer",
                column: "attempt_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_answer_question_id",
                table: "user_answer",
                column: "question_id");

            migrationBuilder.CreateIndex(
                name: "IX_quizzes_teacher_id",
                table: "quizzes",
                column: "teacher_id");

            migrationBuilder.CreateIndex(
                name: "IX_questions_quiz_id",
                table: "questions",
                column: "quiz_id");

            migrationBuilder.CreateIndex(
                name: "IX_attempts_quiz_id",
                table: "attempts",
                column: "quiz_id");

            migrationBuilder.CreateIndex(
                name: "IX_attempts_user_id",
                table: "attempts",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_attempts_quizzes_quiz_id",
                table: "attempts",
                column: "quiz_id",
                principalTable: "quizzes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_attempts_users_user_id",
                table: "attempts",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_questions_quizzes_quiz_id",
                table: "questions",
                column: "quiz_id",
                principalTable: "quizzes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_quizzes_teachers_teacher_id",
                table: "quizzes",
                column: "teacher_id",
                principalTable: "teachers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_answer_attempts_attempt_id",
                table: "user_answer",
                column: "attempt_id",
                principalTable: "attempts",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_answer_questions_question_id",
                table: "user_answer",
                column: "question_id",
                principalTable: "questions",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_attempts_quizzes_quiz_id",
                table: "attempts");

            migrationBuilder.DropForeignKey(
                name: "FK_attempts_users_user_id",
                table: "attempts");

            migrationBuilder.DropForeignKey(
                name: "FK_questions_quizzes_quiz_id",
                table: "questions");

            migrationBuilder.DropForeignKey(
                name: "FK_quizzes_teachers_teacher_id",
                table: "quizzes");

            migrationBuilder.DropForeignKey(
                name: "FK_user_answer_attempts_attempt_id",
                table: "user_answer");

            migrationBuilder.DropForeignKey(
                name: "FK_user_answer_questions_question_id",
                table: "user_answer");

            migrationBuilder.DropIndex(
                name: "IX_user_answer_attempt_id",
                table: "user_answer");

            migrationBuilder.DropIndex(
                name: "IX_user_answer_question_id",
                table: "user_answer");

            migrationBuilder.DropIndex(
                name: "IX_quizzes_teacher_id",
                table: "quizzes");

            migrationBuilder.DropIndex(
                name: "IX_questions_quiz_id",
                table: "questions");

            migrationBuilder.DropIndex(
                name: "IX_attempts_quiz_id",
                table: "attempts");

            migrationBuilder.DropIndex(
                name: "IX_attempts_user_id",
                table: "attempts");
        }
    }
}
