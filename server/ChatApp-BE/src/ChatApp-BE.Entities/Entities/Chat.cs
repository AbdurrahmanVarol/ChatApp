namespace ChatApp_BE.Entities.Entities;
public class Chat : Entity<Guid>
{
    public string? Name { get; set; }
    public bool IsGroup { get; set; }

    public Guid CreatedById { get; set; }
    public User CreatedBy { get; set; } = null!;

    public ICollection<ChatUser> ChatUsers { get; set; } = new List<ChatUser>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}