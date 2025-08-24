namespace ChatApp_BE.Entities.Entities;
public class MessageStatus : Entity<Guid>
{
    public int MessageId { get; set; }
    public Message Message { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
}
