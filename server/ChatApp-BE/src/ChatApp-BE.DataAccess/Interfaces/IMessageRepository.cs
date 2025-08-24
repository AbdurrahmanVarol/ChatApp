using ChatApp_BE.Entities.Entities;

namespace ChatApp_BE.DataAccess.Interfaces;
public interface IMessageRepository : IAsyncRepository<Message, Guid>
{
}
