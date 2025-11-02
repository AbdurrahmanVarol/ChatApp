using ChatApp_BE.Business.Dtos.Request;
using ChatApp_BE.Business.Dtos.Response;
using ChatApp_BE.Business.Interfaces;
using ChatApp_BE.DataAccess.Interfaces;
using ChatApp_BE.Entities.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp_BE.Business.Services;
public class ChatService(IChatRepository chatRepository, IMessageRepository messageRepository) : IChatService
{

    public async Task<Guid> CreateAsync(CreateChatRequest request)
    {
        var chat = new Chat
        {
            Name = request.IsGroup ? request.Name : string.Empty,
            IsGroup = request.IsGroup,
            CreatedById = (Guid)request.CreatedBy,
            CreatedAt = DateTime.UtcNow,
            ChatUsers = [.. request.UserIds.Select(userId => new ChatUser
            {
                UserId = userId,
                JoinedAt = DateTime.UtcNow,
            })]
        };

        chat.ChatUsers.Add(new ChatUser
        {
            UserId = (Guid)request.CreatedBy,
            JoinedAt = DateTime.UtcNow,
        });

        await chatRepository.CreateAsync(chat);
        return chat.Id;
    }


    private string GetProfilePictureUrl(bool isGroup, int genderId)
    {
        if (isGroup) return "images/group-default.jpg";
        var url = genderId switch
        {
            1 => "images/male-default.jpg",
            2 => "images/female-default.jpg",
            _ => "images/default.jpg"
        };
        return url;
    }
    public async Task<IEnumerable<ChatDisplayResponse>> GetChatsByUserIdAsync(Guid userId)
    {
        var chats = await chatRepository.GetListAsync(
            predicate: p => p.ChatUsers.Any(c => c.UserId == userId) || p.CreatedById == userId,
            include: q => q.Include(chat => chat.ChatUsers).ThenInclude(chatUser => chatUser.User));

        var result = chats.Select(chat =>
        {
            var lastMessage = messageRepository.GetListAsync(
                predicate: m => m.ChatId == chat.Id,
                orderBy: o => o.OrderByDescending(m => m.CreatedAt),
                index: 0,
                size: 1).Result.FirstOrDefault();
            var unreadMessagesCount = messageRepository.GetListAsync(
                predicate: m => m.ChatId == chat.Id && !m.IsRead && m.SenderId != userId).Result.Count;
            var chatName = chat.IsGroup
                ? chat.Name
                : chat.ChatUsers.FirstOrDefault(cu => cu.UserId != userId)?.User.FullName ?? "Unknown";
            var chatImage = GetProfilePictureUrl(chat.IsGroup, chat.ChatUsers.FirstOrDefault(cu => cu.UserId != userId)?.User.GenderId ?? 0);

            string? profilePictureBase64 = null;
            var otherUser = chat.ChatUsers.FirstOrDefault(cu => cu.UserId != userId)?.User;
            if (!string.IsNullOrEmpty(chatImage))
            {
                try
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), chatImage.TrimStart('/', '\\'));
                    if (File.Exists(filePath))
                    {
                        var bytes = File.ReadAllBytes(filePath);
                        profilePictureBase64 = Convert.ToBase64String(bytes);
                    }
                }
                catch { profilePictureBase64 = null; }
            }

            return new ChatDisplayResponse
            {
                ChatId = chat.Id,
                ChatName = chatName,
                ProfilePictureBase64 = profilePictureBase64,
                IsGroupChat = chat.IsGroup,
                LastMessage = lastMessage?.Content ?? string.Empty,
                LastMessageTime = lastMessage?.CreatedAt ?? DateTime.MinValue,
                UnreadMessagesCount = unreadMessagesCount
            };
        });
        return result.OrderByDescending(r => r.LastMessageTime);
    }



    public async Task<ChatDetailResponse> GetChatDetailsAsync(Guid chatId, Guid userId)
    {
        var chat = await chatRepository.GetAsync(
            predicate: c => c.Id == chatId && (c.ChatUsers.Any(cu => cu.UserId == userId) || c.CreatedById == userId),
            include: q => q.Include(c => c.ChatUsers).ThenInclude(cu => cu.User));
        var messages = await messageRepository.GetListAsync(
            predicate: m => m.ChatId == chatId,
            include: q => q.Include(m => m.Sender),
            orderBy: o => o.OrderBy(m => m.CreatedAt));
        var result = new ChatDetailResponse
        {
            ChatId = chat.Id,
            ChatName = chat.IsGroup
                ? chat.Name
                : chat.ChatUsers.FirstOrDefault(cu => cu.UserId != userId)?.User.FullName ?? "Unknown",
            IsGroupChat = chat.IsGroup,
            Participants = [.. chat.ChatUsers.Select(cu => new UserResponse
            {
                Id = cu.User.Id,
                FirstName = cu.User.FirstName,
                LastName = cu.User.LastName,
                UserName = cu.User.UserName,
                Email = cu.User.Email
            })],
            Messages = [.. messages.Select(m => new MessageResponse
            {
                MessageId = m.Id,
                SenderId = m.SenderId,
                SenderName = m.Sender.FullName,
                Content = m.Content,
                CreatedAt = m.CreatedAt,
                IsRead = m.IsRead,
                IsOwnMessage = m.SenderId == userId
            })]
        };
        return result;
    }
}
