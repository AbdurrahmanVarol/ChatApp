using ChatApp_BE.Business.Dtos.Response;

namespace ChatApp_BE.Business.Interfaces;
public interface IGenderService
{
    Task<IEnumerable<GenderResponse>> GetGendersAsync();
}
