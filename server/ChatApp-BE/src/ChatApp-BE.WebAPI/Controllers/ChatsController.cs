using ChatApp_BE.Business.Dtos.Request;
using ChatApp_BE.Business.Dtos.Response;
using ChatApp_BE.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp_BE.WebAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ChatsController(IChatService chatService) : ControllerBase
{
    private Guid UserId => Guid.Parse(HttpContext.User.Claims.First(p => p.Type.Equals(ClaimTypes.NameIdentifier)).Value);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateChatRequest request)
    {
        request.CreatedBy = UserId;
        var id = await chatService.CreateAsync(request);
        return Created("", value: new { id });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ChatDisplayResponse>>> GetChatsByUserId()
    {
        var chats = await chatService.GetChatsByUserIdAsync(UserId);
        return Ok(chats);
    }

    [HttpGet("{chatId:guid}/details")]
    public async Task<ActionResult<ChatDetailResponse>> GetChatDetails(Guid chatId)
    {
        var chatDetails = await chatService.GetChatDetailsAsync(chatId, UserId);
        if (chatDetails == null)
            return NotFound();
        return Ok(chatDetails);
    }
}
