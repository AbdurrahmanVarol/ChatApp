using ChatApp_BE.DataAccess.EntityFramework.Contexts;
using ChatApp_BE.DataAccess.Interfaces;
using ChatApp_BE.Entities.Entities;

namespace ChatApp_BE.DataAccess.EntityFramework.Repositories;
public class EfMessageStatusRepository(ChatAppContext context) : EfRepositoryBase<MessageStatus, Guid, ChatAppContext>(context), IMessageStatusRepository
{
}
