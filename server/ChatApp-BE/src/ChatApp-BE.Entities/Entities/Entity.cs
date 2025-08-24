namespace ChatApp_BE.Entities.Entities;
public class Entity<TId> : IEntityTimestamps
{
    public TId Id { get; set; } = default!;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedDate { get; set; }
    public DateTime? DeletedDate { get; set; }
}
