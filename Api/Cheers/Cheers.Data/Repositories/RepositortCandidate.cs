using Cheers.Core.Entities;
using Cheers.Core.IRepository;
using Microsoft.EntityFrameworkCore;

namespace Cheers.Data.Repositories
{
    public class RepositortCandidate : IRepositoryCandidate
    {

        private readonly DataContext _context;

        public RepositortCandidate(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Candidate>> GetListOfWomenAsync()
        {
            return await _context.Candidates.ToListAsync();
            //.Include(w => w.) // כולל את המידע על השידוכים הקשורים

        }

        public async Task<Candidate> GetWomenByIdAsync(int id)
        {
            return await _context.Candidates.FirstOrDefaultAsync(w => w.Id == id);
            //.Include(w => w.FamilyDet
            //ails)

        }

        public async Task<Candidate> AddWomenAsync(Candidate candidate)
        {
            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();
            return candidate;
        }

        public async Task<Candidate> DeleteWomenAsync(int id)
        {
            var Candidate = await _context.Candidates.FindAsync(id);
            if (Candidate != null)
            {
                _context.Candidates.Remove(Candidate);
                await _context.SaveChangesAsync();
            }
            return Candidate;
        }

        public async Task<Candidate> UpdateWomenAsync(int id, Candidate Candidate)
        {
            var existingCandidate = await GetWomenByIdAsync(id);
            if (existingCandidate != null)
            {
                // שמור את ה-ID המקורי
                var originalId = existingCandidate.Id;

                // עדכן את כל הערכים

                // וודא שה-ID לא השתנה
                existingCandidate.Id = originalId;

                // עדכן את השדות הייחודיים של Candidate
                existingCandidate.Seminar = Candidate.Seminar;
                existingCandidate.AnOutsider = Candidate.AnOutsider;
                existingCandidate.PrefferedIsLearning = Candidate.PrefferedIsLearning;
                existingCandidate.PrefferedYeshivaStyle = Candidate.PrefferedYeshivaStyle;
                existingCandidate.Professional = Candidate.Professional;
                existingCandidate.HeadCovering = Candidate.HeadCovering;

                await _context.SaveChangesAsync();
            }
            return existingCandidate;
        }

        public async Task<Candidate> GetCandidateByEmailAsync(string email)
        {
            return await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);
        }
    }
}

