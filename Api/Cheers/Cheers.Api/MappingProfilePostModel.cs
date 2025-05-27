using AutoMapper;
using Cheers.Api.Models;
using Cheers.Core.DTOs;

namespace Cheers.Api
{
    public class MappingProfilePostModel:Profile
    {

        public MappingProfilePostModel()
        {
            
            CreateMap<RegisterModel,UserDTOs>().ReverseMap();
            //CreateMap<MatchMakingModel,MatchMakingDTOs>().ReverseMap();
            //CreateMap<MeetingModel,MeetingDTOs>().ReverseMap();
            CreateMap<CandidateModel,CandidateDTOs>().ReverseMap();
            CreateMap<UserPostModel,UserDTOs>().ReverseMap();
 
        }
    }
}
