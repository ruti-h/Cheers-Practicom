
using Cheers.Core.DTOs;

namespace Cheers.Core.IServices
{
   public interface IServiceCandidate
    {
        public Task<IEnumerable<CandidateDTOs>> GetListOfWomenAsync();
        public Task<CandidateDTOs> GetWomenByIdAsync(int id);
        public Task<CandidateDTOs> AddWomenAsync(CandidateDTOs women);
        public Task<CandidateDTOs> DeleteWomenAsync(int id);
        public Task<CandidateDTOs> UpdateWomenAsync(int id, CandidateDTOs women);
        public Task<bool> CheckCandidateCompletionByEmailAsync(string email);

    }
}
