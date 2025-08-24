namespace ChatApp_BE.Business.Dtos.Request;
public class RegisterRequest
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? Email { get; set; }
    public required string UserName { get; set; }
    public required string Password { get; set; }
    public required string PasswordConfirm { get; set; }
    public int GenderId { get; set; }
}
