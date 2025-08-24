namespace ChatApp_BE.Business.Dtos.Response;
public class LoginResponse
{
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public string Name { get; set; }
    public DateTime Expire { get; set; }
}