using ChatApp_BE.Business.Dtos.Response;
using ChatApp_BE.Entities.Entities;

namespace ChatApp_BE.Business.Interfaces;
public interface IUserService
{
    Task<User> GetByUsernameAsync(string username);
    Task CreateAsync(User user);
    Task<IEnumerable<UserResponse>> GetUsers();
    Task<UserResponse> GetUserById(Guid userId);
    Task<IEnumerable<UserResponse>> GetUsersByName(string name);
}
