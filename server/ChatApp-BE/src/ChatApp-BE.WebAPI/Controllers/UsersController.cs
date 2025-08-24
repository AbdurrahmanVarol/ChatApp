using ChatApp_BE.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp_BE.WebAPI.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController(IUserService userService) : ControllerBase
{
    private Guid UserId => Guid.Parse(HttpContext.User.Claims.First(p => p.Type.Equals(ClaimTypes.NameIdentifier)).Value);
    [HttpGet]
    public async Task<ActionResult> GetUser()
    {
        var user = await userService.GetUsers();
        return Ok(user);
    }

    [HttpGet("info")]
    public async Task<ActionResult> GetUserById()
    {
        var user = await userService.GetUserById(UserId);
        return Ok(user);
    }



}
