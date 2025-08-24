using ChatApp_BE.DataAccess.EntityFramework.Contexts;
using ChatApp_BE.DataAccess.Interfaces;
using ChatApp_BE.Entities.Entities;

namespace ChatApp_BE.DataAccess.EntityFramework.Repositories;
public class EfGenderRepository(ChatAppContext context) : EfRepositoryBase<Gender, int, ChatAppContext>(context), IGenderRepository
{
}
