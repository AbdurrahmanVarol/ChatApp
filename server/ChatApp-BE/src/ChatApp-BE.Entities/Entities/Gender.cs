namespace ChatApp_BE.Entities.Entities;
public class Gender : Entity<int>
{
    public required string Name { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
}
