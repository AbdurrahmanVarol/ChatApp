namespace ChatApp_BE.Business.Dtos.Request;
public class CreateChatRequest
{
    public string Name { get; set; } = string.Empty;
    public bool IsGroup { get; set; }
    public Guid? CreatedBy { get; set; }
    public List<Guid> UserIds { get; set; } = new();
}
