namespace ChatApp_BE.Entities.Entities;
public class Message : Entity<Guid>
{
    public Guid ChatId { get; set; }
    public Chat Chat { get; set; } = null!;

    public Guid SenderId { get; set; }
    public User Sender { get; set; } = null!;

    public string Content { get; set; } = null!;
    public bool IsRead { get; set; }
    public bool IsEdited { get; set; }
    public bool IsDeleted { get; set; }

    public ICollection<MessageStatus> MessageStatuses { get; set; } = new List<MessageStatus>();
}
