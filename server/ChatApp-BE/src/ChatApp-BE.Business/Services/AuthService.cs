using AutoMapper;
using ChatApp_BE.Business.Dtos.Request;
using ChatApp_BE.Business.Dtos.Response;
using ChatApp_BE.Business.Interfaces;
using ChatApp_BE.Entities.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChatApp_BE.Business.Services;
public class AuthService(IUserService userService, IConfiguration configuration, IMapper mapper) : IAuthService
{

    private void CreatePasswordHash(string password, out string passwordHash, out string passwordSalt)
    {
        using var hmac = new System.Security.Cryptography.HMACSHA512();
        passwordSalt = Convert.ToBase64String(hmac.Key);
        passwordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
    }

    private string GenerateToken(User user)
    {
        var key = configuration.GetSection("JWT:Key").Value;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creadentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
            new Claim(ClaimTypes.Name,user.FirstName),
            new Claim(ClaimTypes.Surname,user.LastName),
        };
        var jwtSecurityToken = new JwtSecurityToken(
            issuer: "",
            audience: "",
            claims: claims,
            expires: DateTime.Now.AddDays(5),
            notBefore: DateTime.Now,
            signingCredentials: creadentials);

        var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

        return token;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest loginRequest)
    {
        if (loginRequest is null)
        {
            throw new ArgumentNullException(nameof(loginRequest));
        }
        var user = await userService.GetByUsernameAsync(loginRequest.UserName) ?? throw new ArgumentException($"Kullanıcı adı ya da şifre hatalı");

        if (!VerifyPasswordHash(loginRequest.Password, user.PasswordHash, user.PasswordSalt))
        {
            throw new ArgumentException("Kullanıcı adı ya da şifre hatalı");
        }

        var token = GenerateToken(user);
        var response = new LoginResponse
        {
            Token = token,
            Name = $"{user.FirstName} {user.LastName}",
            Expire = DateTime.Now.AddDays(5),
            RefreshToken = user.RefreshToken
        };
        return response;
    }
    private bool VerifyPasswordHash(string password, string passwordHash, string passwordSalt)
    {
        using var hmac = new System.Security.Cryptography.HMACSHA512(Convert.FromBase64String(passwordSalt));

        var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));

        return passwordHash.Equals(computedHash);
    }

    private string GetProfilePictureUrl(int genderId)
    {
        var url = genderId switch
        {
            1 => "images/male-default.jpg",
            2 => "images/female-default.jpg",
            _ => "images/default.jpg"
        };
        return url;
    }
    public async Task RegisterAsync(RegisterRequest registerRequest)
    {
        //TODO: Validasyon eklenecek
        CreatePasswordHash(registerRequest.Password, out string passwordHash, out string passwordSalt);
        var user = new User
        {
            FirstName = registerRequest.FirstName,
            LastName = registerRequest.LastName,
            Email = registerRequest.Email,
            UserName = registerRequest.UserName,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            CreatedAt = DateTime.Now,
            RefreshToken = Guid.NewGuid().ToString(),
            GenderId = registerRequest.GenderId,
            Bio = registerRequest.Bio,
            ProfilePictureUrl = GetProfilePictureUrl(registerRequest.GenderId),
        };
        await userService.CreateAsync(user);
    }

}