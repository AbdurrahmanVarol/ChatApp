using ChatApp_BE.Business.Interfaces;
using ChatApp_BE.Business.Services;
using ChatApp_BE.DataAccess;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ChatApp_BE.Business;
public static class DependencyResolver
{
    public static void AddBusinessServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDataAccessServices(configuration);

        var assembly = Assembly.GetExecutingAssembly();
        services.AddAutoMapper(assembly);
        services.AddValidatorsFromAssembly(assembly);

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IGenderService, GenderService>();
    }
}
