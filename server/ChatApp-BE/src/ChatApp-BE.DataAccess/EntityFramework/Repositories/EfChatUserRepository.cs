using ChatApp_BE.DataAccess.EntityFramework.Contexts;
using ChatApp_BE.DataAccess.Interfaces;
using ChatApp_BE.Entities.Entities;

namespace ChatApp_BE.DataAccess.EntityFramework.Repositories;
public class EfChatUserRepository(ChatAppContext context) : EfRepositoryBase<ChatUser, Guid, ChatAppContext>(context), IChatUserRepository
{
}
