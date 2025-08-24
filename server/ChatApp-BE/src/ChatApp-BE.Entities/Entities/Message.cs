namespace ChatApp_BE.Entities.Entities;
public class Message : Entity<Guid>
{
    public int ChatId { get; set; }
    public Chat Chat { get; set; } = null!;

    public int SenderId { get; set; }
    public User Sender { get; set; } = null!;

    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsEdited { get; set; }
    public bool IsDeleted { get; set; }

    public ICollection<MessageStatus> MessageStatuses { get; set; } = new List<MessageStatus>();
}
