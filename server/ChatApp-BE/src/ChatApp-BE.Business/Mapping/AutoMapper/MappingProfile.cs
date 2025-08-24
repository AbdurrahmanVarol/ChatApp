using AutoMapper;
using ChatApp_BE.Business.Dtos.Response;
using ChatApp_BE.Entities.Entities;

namespace ChatApp_BE.Business.Mapping.AutoMapper;
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserResponse>()
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender != null ? src.Gender.Name : "Unknown"))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
            .ForMember(dest => dest.LastMessageDate, opt => opt.Ignore())
            .ForMember(dest => dest.LastMessage, opt => opt.Ignore());

        CreateMap<Gender, GenderResponse>();
    }
}
