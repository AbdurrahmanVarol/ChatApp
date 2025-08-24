using Bogus;
using ChatApp_BE.DataAccess.EntityFramework.Contexts;
using ChatApp_BE.Entities.Entities;

namespace ChatApp_BE.DataAccess.EntityFramework.Seeding;
public static class EfDbSeeding
{
    public static void SeedDatabase(ChatAppContext context)
    {
        SeedGenderIfNoExists(context);
        SeedUserIfNoExists(context);

    }
    private static string GetProfilePictureUrl(int genderId)
    {
        var url = genderId switch
        {
            1 => "images/male-default.jpg",
            2 => "images/female-default.jpg",
            _ => "images/default.jpg"
        };
        return url;
    }
    private static void SeedUserIfNoExists(ChatAppContext context)
    {
        if (!context.Users.Any())
        {
            //password:12345
            var passwordSalt = "8qjYoxBQ2SgvH7vcbDsPbus2YFpicja5cDbz9IL6hJIgS4gTgr5uq1ADDLy7GHsIEY+0otBju+h74HRuNuFnU25/HWCXOjdKqPlksusj7mNjAR6rk9K9Oy4s1wIySzCoy3xi205Kqhgb4NJ0UcryFCvT6G/9QDQ63A9NyNVQ8s0=";
            var passwordHash = "WMA4dhrMhW2ZW3+8wIlpzcew0pVATmgSq4WZ+tjmiOW1R09J5lKdcxR16RIT1ds44FjeYM0o+ksAeTzSX6aXZQ==";

            var users = new List<User>() {
                new User
                {
                    FirstName = "Abdurrahman",
                    LastName = "Varol",
                    Email = "abdurrahman@gmail.com",
                    UserName = "abdurrahman",
                    GenderId = 1,
                    PasswordSalt = passwordSalt,
                    PasswordHash = passwordHash,
                    RefreshToken = Guid.NewGuid().ToString(),
                }
            };

            var faker = new Faker<User>("tr")
                .RuleFor(u => u.FirstName, f => f.Name.FirstName())
                .RuleFor(u => u.LastName, f => f.Name.LastName())
                .RuleFor(u => u.UserName, (f, u) => f.Internet.UserName(u.FirstName, u.LastName) + f.Random.Number(10000, 99999))
                .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FirstName, u.LastName))
                .RuleFor(u => u.PasswordSalt, f => passwordSalt)
                .RuleFor(u => u.PasswordHash, f => passwordHash)
                .RuleFor(u => u.RefreshToken, f => Guid.NewGuid().ToString())
                .RuleFor(u => u.GenderId, f => f.PickRandom<Bogus.DataSets.Name.Gender>() == Bogus.DataSets.Name.Gender.Male ? 1 : 2)
                .RuleFor(u => u.ProfilePictureUrl, (f, u) => GetProfilePictureUrl(u.GenderId));

            var generatedUsers = faker.Generate(1000);
            users.AddRange(generatedUsers);

            context.Users.AddRange(users);
            context.SaveChanges();
        }
    }

    private static void SeedGenderIfNoExists(ChatAppContext context)
    {
        if (!context.Genders.Any())
        {
            var genders = new List<Gender>()
            {
                new()
                {
                    Name = "Erkek"
                },
                new()
                {
                    Name = "Kadın"
                }
            };
            context.AddRange(genders);
            context.SaveChanges();
        }
    }
}