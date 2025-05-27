using AutoMapper;
using Cheers.Core.DTOs;
using Cheers.Core.Entities;
using Cheers.Core.IRepository;
using Cheers.Core.IServices;

namespace Cheers.Service.Services
{
   public class CandidateService:IServiceCandidate
    {
        private readonly IRepositoryCandidate _CandidateRepository;
        private readonly IMapper _mapper;

        public CandidateService(IRepositoryCandidate CandidateRepository, IMapper mapper)
        {
            _CandidateRepository = CandidateRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CandidateDTOs>> GetListOfWomenAsync()
        {
            var women = await _CandidateRepository.GetListOfWomenAsync();
            return _mapper.Map<IEnumerable<CandidateDTOs>>(women);
        }

        public async Task<CandidateDTOs> GetWomenByIdAsync(int id)
        {
            var Candidate = await _CandidateRepository.GetWomenByIdAsync(id);
            return _mapper.Map<CandidateDTOs>(Candidate);
        }

        public async Task<CandidateDTOs> AddWomenAsync(CandidateDTOs womenDto)
        {
            var Candidate = _mapper.Map<Candidate>(womenDto);
            var addedCandidate = await _CandidateRepository.AddWomenAsync(Candidate);
            return _mapper.Map<CandidateDTOs>(addedCandidate);
        }
        public async Task<CandidateDTOs> DeleteWomenAsync(int id)
        {
            var deletedCandidate = await _CandidateRepository.DeleteWomenAsync(id);
            return _mapper.Map<CandidateDTOs>(deletedCandidate);
        }

        public async Task<CandidateDTOs> UpdateWomenAsync(int id, CandidateDTOs womenDto)
        {
            var Candidate = _mapper.Map<Candidate>(womenDto);
            var updatedCandidate = await _CandidateRepository.UpdateWomenAsync(id, Candidate);
            return _mapper.Map<CandidateDTOs>(updatedCandidate);
        }

        public async Task<bool> CheckCandidateCompletionByEmailAsync(string email)
        {
            var candidate = await _CandidateRepository.GetCandidateByEmailAsync(email);

            if (candidate == null)
            {
                Console.WriteLine($"לא נמצא מועמד עם Email: {email}");
                return false;
            }

            Console.WriteLine($"נמצא מועמד - ID: {candidate.Id}");

            // בדוק רק את השדות החיוניים שחייבים להיות מלאים
            bool isCompleted = !string.IsNullOrEmpty(candidate.FirstName) &&
                              !string.IsNullOrEmpty(candidate.LastName) &&
                              !string.IsNullOrEmpty(candidate.Email);
            // הסרתי Phone ו-Tz כי הם יכולים להיות ריקים

            Console.WriteLine($"FirstName: '{candidate.FirstName}'");
            Console.WriteLine($"LastName: '{candidate.LastName}'");
            Console.WriteLine($"Email: '{candidate.Email}'");
            Console.WriteLine($"isCompleted: {isCompleted}");

            return isCompleted;
        }
    }
}
