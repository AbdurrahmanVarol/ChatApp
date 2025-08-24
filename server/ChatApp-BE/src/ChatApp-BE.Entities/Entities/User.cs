namespace ChatApp_BE.Entities.Entities;
public class User : Entity<Guid>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? Email { get; set; }
    public required string UserName { get; set; }
    public required string PasswordHash { get; set; }
    public required string PasswordSalt { get; set; }
    public required string RefreshToken { get; set; }

    public int GenderId { get; set; }
    public Gender? Gender { get; set; }
}