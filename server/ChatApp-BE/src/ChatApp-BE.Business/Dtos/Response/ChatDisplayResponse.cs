namespace ChatApp_BE.Business.Dtos.Response;
public class ChatDisplayResponse
{
    public Guid ChatId { get; set; }
    public string ChatName { get; set; }
    public string? ProfilePictureBase64 { get; set; }
    public bool IsGroupChat { get; set; }
    public string LastMessage { get; set; } = string.Empty;
    public DateTime LastMessageTime { get; set; }
    public int UnreadMessagesCount { get; set; }
}