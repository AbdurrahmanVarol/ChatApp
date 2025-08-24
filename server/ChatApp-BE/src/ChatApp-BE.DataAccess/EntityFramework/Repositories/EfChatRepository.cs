using ChatApp_BE.DataAccess.EntityFramework.Contexts;
using ChatApp_BE.DataAccess.Interfaces;
using ChatApp_BE.Entities.Entities;

namespace ChatApp_BE.DataAccess.EntityFramework.Repositories;
public class EfChatRepository(ChatAppContext context) : EfRepositoryBase<Chat, Guid, ChatAppContext>(context), IChatRepository
{
}
