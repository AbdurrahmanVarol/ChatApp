using ChatApp_BE.Business.Dtos.Request;
using ChatApp_BE.Business.Dtos.Response;
using ChatApp_BE.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp_BE.WebAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AuthController(IAuthService authService) : ControllerBase
{

    [HttpPost("login")]
    public async Task<ActionResult<UserResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await authService.LoginAsync(request);
        return Ok(user);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        await authService.RegisterAsync(request);
        return Created();
    }
}
