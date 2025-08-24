using ChatApp_BE.Business.Dtos.Request;
using ChatApp_BE.Business.Dtos.Response;

namespace ChatApp_BE.Business.Interfaces;
public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest loginRequest);
    Task RegisterAsync(RegisterRequest registerRequest);
}
