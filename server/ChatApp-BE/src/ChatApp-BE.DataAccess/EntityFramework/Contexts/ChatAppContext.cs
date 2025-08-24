using ChatApp_BE.Entities.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace ChatApp_BE.DataAccess.EntityFramework.Contexts;
public class ChatAppContext(DbContextOptions<ChatAppContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<MessageStatus> MessageStatuses { get; set; }
    public DbSet<Chat> Chats { get; set; }
    public DbSet<ChatUser> ChatUsers { get; set; }
    public DbSet<Gender> Genders { get; set; }
    //public DbSet<Friendship> Friendships { get; set; }
    //public DbSet<Conversation> Conversations { get; set; } 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

}
