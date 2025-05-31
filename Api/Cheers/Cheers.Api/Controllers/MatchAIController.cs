using Cheers.Core.DTOs;
using Cheers.Core.Entities;
using Cheers.Data;
using Cheers.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Cheers.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchAIController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly GptService _gptService;

        public MatchAIController(DataContext context, GptService gptService)
        {
            _context = context;
            _gptService = gptService;
        }

        [HttpPost("get-gpt-matches")]
        public async Task<ActionResult<List<object>>> GetMatchesFromGpt([FromBody] int userId)
        {
            // שלב 1: מצא את המועמד עצמו
            var user = await _context.Candidates.FindAsync(userId);
            if (user == null)
                return NotFound("מועמד לא נמצא");

            // שלב 2: מצא משתמשים מהמגדר ההפוך
            string userGender = user.Gender;
            string oppositeGender = userGender == "Male" ? "Female" : "Male";

            var oppositeGenderUsers = await _context.Candidates
                .Where(c => c.Gender == oppositeGender)
                .ToListAsync();

            // שלב 3: הפוך את הנתונים ל-JSON
            var candidateJson = JsonSerializer.Serialize(user);
            var allCandidatesJson = JsonSerializer.Serialize(oppositeGenderUsers.Select(c => new
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                // שדות נוספים
            }));

            // שלב 4: שלח ל-GPT לקבלת תוצאות
            List<MatchResult> gptResults;
            try
            {
                gptResults = await _gptService.GetMatchesFromGptAsync(candidateJson, allCandidatesJson);
                if (gptResults == null)
                    return StatusCode(500, "קבלת תוצאות ריקות מ-GPT");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה בעת קריאת GPT: {ex.Message}");
            }

            // שלב 5: העשרת התוצאה
            var enrichedResults = gptResults.Select(result =>
            {
                var matchedUser = oppositeGenderUsers.FirstOrDefault(u => u.Id == result.UserId);
                if (matchedUser == null) return null;

                return new
                {
                    UserId = matchedUser.Id,
                    FullName = $"{matchedUser.FirstName} {matchedUser.LastName}",
                    Score = result.Score,
                    Warnings = result.Comment
                };
            }).Where(x => x != null).ToList();

            return Ok(enrichedResults);
        }
    }
}
