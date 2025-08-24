using ChatApp_BE.DataAccess.EntityFramework.Contexts;
using ChatApp_BE.DataAccess.EntityFramework.Repositories;
using ChatApp_BE.DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ChatApp_BE.DataAccess;
public static class DependencyResolver
{
    public static void AddDataAccessServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<ChatAppContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        services.AddScoped<IUserRepository, EfUserRepository>();
        services.AddScoped<IGenderRepository, EfGenderRepository>();
        services.AddScoped<IMessageRepository, EfMessageRepository>();
        services.AddScoped<IMessageStatusRepository, EfMessageStatusRepository>();
        services.AddScoped<IChatUserRepository, EfChatUserRepository>();
        services.AddScoped<IChatRepository, EfChatRepository>();
    }
}
