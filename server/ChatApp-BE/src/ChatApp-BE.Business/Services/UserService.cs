using AutoMapper;
using ChatApp_BE.Business.Dtos.Response;
using ChatApp_BE.Business.Interfaces;
using ChatApp_BE.DataAccess.Interfaces;
using ChatApp_BE.Entities.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp_BE.Business.Services;
public class UserService(IUserRepository userRepository, IMapper mapper) : IUserService
{
    public async Task CreateAsync(User user)
    {
        await userRepository.CreateAsync(user);
    }

    public async Task<User> GetByUsernameAsync(string username)
    {
        var user = await userRepository.GetAsync(
            predicate: u => u.UserName == username,
            include: source => source.Include(u => u.Gender)
        );
        return user;
    }
    public async Task<IEnumerable<UserResponse>> GetUsers()
    {
        var users = await userRepository.GetListAsync(
            include: source => source.Include(u => u.Gender));
        var mapped = mapper.Map<IEnumerable<UserResponse>>(users);
        foreach (var (user, entity) in mapped.Zip(users, (dto, ent) => (dto, ent)))
        {
            if (!string.IsNullOrEmpty(entity.ProfilePictureUrl))
            {
                try
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), entity.ProfilePictureUrl.TrimStart('/', '\\'));
                    if (File.Exists(filePath))
                    {
                        var bytes = await File.ReadAllBytesAsync(filePath);
                        user.ProfilePictureBase64 = Convert.ToBase64String(bytes);
                    }
                }
                catch { user.ProfilePictureBase64 = null; }
            }
        }
        return mapped;
    }
    public async Task<UserResponse> GetUserById(Guid userId)
    {
        var user = await userRepository.GetAsync(
            predicate: u => u.Id == userId,
            include: source => source.Include(u => u.Gender));
        var mapped = mapper.Map<UserResponse>(user);

        if (!string.IsNullOrEmpty(user.ProfilePictureUrl))
        {
            try
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), user.ProfilePictureUrl.TrimStart('/', '\\'));
                if (File.Exists(filePath))
                {
                    var bytes = await File.ReadAllBytesAsync(filePath);
                    mapped.ProfilePictureBase64 = Convert.ToBase64String(bytes);
                }
            }
            catch { mapped.ProfilePictureBase64 = null; }
        }

        return mapped;
    }
    public async Task<IEnumerable<UserResponse>> GetUsersByName(string name)
    {
        var users = await userRepository.GetListAsync(
            predicate: u => u.FirstName.Contains(name) || u.LastName.Contains(name),
            include: source => source.Include(u => u.Gender));
        var mapped = mapper.Map<IEnumerable<UserResponse>>(users);
        foreach (var (user, entity) in mapped.Zip(users, (dto, ent) => (dto, ent)))
        {
            if (!string.IsNullOrEmpty(entity.ProfilePictureUrl))
            {
                try
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), entity.ProfilePictureUrl.TrimStart('/', '\\'));
                    if (File.Exists(filePath))
                    {
                        var bytes = await File.ReadAllBytesAsync(filePath);
                        user.ProfilePictureBase64 = Convert.ToBase64String(bytes);
                    }
                }
                catch { user.ProfilePictureBase64 = null; }
            }
        }
        return mapped;
    }
}
