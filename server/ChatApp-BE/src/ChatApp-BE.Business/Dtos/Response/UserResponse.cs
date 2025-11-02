namespace ChatApp_BE.Business.Dtos.Response;
public class UserResponse
{
    public Guid Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string FullName => $"{FirstName} {LastName}";
    public string? Bio { get; set; }
    public string? ProfilePictureBase64 { get; set; }
    public string? Email { get; set; }
    public required string UserName { get; set; }
    public string Gender { get; set; }
}
