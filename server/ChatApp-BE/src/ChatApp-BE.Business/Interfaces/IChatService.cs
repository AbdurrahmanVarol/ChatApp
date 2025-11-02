using ChatApp_BE.Business.Dtos.Request;
using ChatApp_BE.Business.Dtos.Response;

namespace ChatApp_BE.Business.Interfaces;
public interface IChatService
{
    Task<Guid> CreateAsync(CreateChatRequest request);
    Task<ChatDetailResponse> GetChatDetailsAsync(Guid chatId, Guid userId);
    Task<IEnumerable<ChatDisplayResponse>> GetChatsByUserIdAsync(Guid userId);
}