using AutoMapper;
using Cheers.Api.Models;
using Cheers.Core.DTOs;
using Cheers.Core.IServices;
using Cheers.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Cheers.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private readonly IServiceCandidate _CandidateService;
        private readonly IMapper _mapper;

        public CandidateController(IServiceCandidate CandidateService, IMapper mapper)
        {
            _CandidateService = CandidateService;
            _mapper = mapper;
        }

        // GET: api/Candidate
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CandidateDTOs>>> GetWomen()
        {
            var women = await _CandidateService.GetListOfWomenAsync();
            return Ok(women);
        }

        // GET api/Candidate/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CandidateDTOs>> GetCandidate(int id)
        {
            var Candidate = await _CandidateService.GetWomenByIdAsync(id);
          //  if (Candidate == null) return NotFound();
            return Ok(Candidate);
        }

        // POST api/Candidate
        [HttpPost]
        public async Task<ActionResult<CandidateDTOs>> PostCandidate([FromBody] CandidateModel Candidate)
        {
            if (Candidate == null) return BadRequest("Candidate model cannot be null.");

         
            // מיפוי מהמודל ל-DTO
            var CandidateDto = _mapper.Map<CandidateDTOs>(Candidate);

            // העברת CandidateDto ו-FamilyDetailId בנפרד
            var addedCandidate = await _CandidateService.AddWomenAsync(CandidateDto);

            return CreatedAtAction(nameof(GetCandidate), new { id = addedCandidate.Id }, addedCandidate);
        }

        // PUT api/Candidate/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<CandidateDTOs>> PutCandidate(int id, [FromBody]CandidateModel  Candidate)
        {
            if (Candidate == null) return BadRequest("Candidate model cannot be null.");

            var CandidateModel = _mapper.Map<CandidateDTOs>(Candidate); // מיפוי ל-Candidate
            var updatedCandidate = await _CandidateService.UpdateWomenAsync(id, CandidateModel);
           // if (updatedCandidate == null) return NotFound();

            var updatedCandidateDto = _mapper.Map<CandidateDTOs>(updatedCandidate); // מיפוי חזרה ל-CandidateDTOs
            return Ok(updatedCandidateDto);
        }

        // DELETE api/Candidate/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<CandidateDTOs>> DeleteCandidate(int id)
        {
            var deletedCandidate = await _CandidateService.DeleteWomenAsync(id);
            //if (deletedCandidate == null) return NotFound();

            var deletedCandidateDto = _mapper.Map<CandidateDTOs>(deletedCandidate); // מיפוי חזרה ל-CandidateDTOs
            return Ok(deletedCandidateDto);
        }
        [HttpGet("check-completion/{userEmail}")]
        public async Task<IActionResult> CheckCandidateCompletion(string userEmail)
        {
            try
            {
                if (string.IsNullOrEmpty(userEmail))
                {
                    return BadRequest(new { isCompleted = false, error = "Email is required" });
                }

                bool isCompleted = await _CandidateService.CheckCandidateCompletionByEmailAsync(userEmail);
                return Ok(new { isCompleted });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    isCompleted = false,
                    error = "שגיאה בבדיקת סטטוס המועמד"
                });
            }
        }
        //[HttpDelete("{id}")]
        //public async Task<ActionResult<CandidateDTOs>> DeleteCandidate(int id)
        //{
        //    var Candidate = await _CandidateService.GetWomenByIdAsync(id);
        //    if (Candidate == null) return NotFound();

        //    // שמירת ה-FamilyDetailId לפני המחיקה
        //    int? familyDetailId = Candidate.FamilyDetailId;  // אם CandidateDTOs מכיל את השדה

        //    var deletedCandidate = await _CandidateService.DeleteWomenAsync(id);

        //    // מחיקת ה-FamilyDetail אם קיים
        //    if (familyDetailId.HasValue)
        //    {
        //        await _familyDetailService.DeleteFamilyDetailIfExistsAsync(familyDetailId.Value);
        //    }

        //    return Ok(deletedCandidate);
        //}
    }
}
