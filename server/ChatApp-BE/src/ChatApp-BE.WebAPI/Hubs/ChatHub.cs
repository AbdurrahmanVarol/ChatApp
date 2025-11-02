using ChatApp_BE.DataAccess.Interfaces;
using ChatApp_BE.Entities.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace ChatApp_BE.WebAPI.Hubs;


[Authorize]
public class ChatHub(IMessageRepository messageRepository) : Hub
{
    public async Task JoinChat(string chatId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
    }

    public async Task LeaveChat(string chatId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId);
    }

    public async Task SendMessage(string chatId, string message)
    {
        var userId = Context.User.Claims.First(p => p.Type.Equals(ClaimTypes.NameIdentifier)).Value;
        var messageEntity = new Message
        {
            ChatId = Guid.Parse(chatId),
            Content = message,
            SenderId = Guid.Parse(userId),
            IsRead = false
        };
        await messageRepository.CreateAsync(messageEntity);
        await Clients.Group(chatId).SendAsync("ReceiveMessage", chatId, message, userId, DateTime.UtcNow);
    }
}