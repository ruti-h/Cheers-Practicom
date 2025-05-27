

using Cheers.Core.Entities;

namespace Cheers.Core.IRepository
{
    public interface IRepositoryCandidate
    {
        public Task<IEnumerable<Candidate>> GetListOfWomenAsync();
        public Task<Candidate> GetWomenByIdAsync(int id);
        public Task<Candidate> AddWomenAsync(Candidate women);
        public Task<Candidate> DeleteWomenAsync(int id);
        public Task<Candidate> UpdateWomenAsync(int id, Candidate women);
        public Task<Candidate> GetCandidateByEmailAsync(string email);


    }
}
