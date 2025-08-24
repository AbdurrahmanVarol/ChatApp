using AutoMapper;
using ChatApp_BE.Business.Dtos.Response;
using ChatApp_BE.Business.Interfaces;
using ChatApp_BE.DataAccess.Interfaces;

namespace ChatApp_BE.Business.Services;
public class GenderService(IGenderRepository genderRepository, IMapper mapper) : IGenderService
{


    public async Task<IEnumerable<GenderResponse>> GetGendersAsync()
    {
        var genders = await genderRepository.GetListAsync();
        return mapper.Map<IEnumerable<GenderResponse>>(genders);
    }
}
