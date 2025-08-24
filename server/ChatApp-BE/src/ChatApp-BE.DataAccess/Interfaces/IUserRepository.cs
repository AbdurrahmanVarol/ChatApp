using ChatApp_BE.Entities.Entities;

namespace ChatApp_BE.DataAccess.Interfaces;
public interface IUserRepository : IAsyncRepository<User, Guid>
{
}
