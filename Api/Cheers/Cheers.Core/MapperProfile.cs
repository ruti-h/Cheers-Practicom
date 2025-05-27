

using AutoMapper;
using Cheers.Core.DTOs;
using Cheers.Core.Entities;

namespace Cheers.Core
{
   public class MapperProfile:Profile
    {

        public MapperProfile()
        {
            
            CreateMap<CandidateDTOs, Candidate>().ReverseMap();
            //CreateMap<MatchMakingDTOs, MatchMaker>().ReverseMap();
            //CreateMap<MeetingDTOs, Meeting>().ReverseMap();
            CreateMap<UserDTOs, User>().ReverseMap();
        }
    
    }
}
