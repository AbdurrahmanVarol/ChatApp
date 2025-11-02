namespace ChatApp_BE.Business.Dtos.Response;

public class ChatDetailResponse
{
    public Guid ChatId { get; set; }
    public string ChatName { get; set; }
    public bool IsGroupChat { get; set; }
    public List<UserResponse> Participants { get; set; } = new();
    public List<MessageResponse> Messages { get; set; } = new();
}
