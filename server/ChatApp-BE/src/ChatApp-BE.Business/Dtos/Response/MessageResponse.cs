namespace ChatApp_BE.Business.Dtos.Response;
public class MessageResponse
{
    public Guid MessageId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    public bool IsOwnMessage { get; set; }
}
