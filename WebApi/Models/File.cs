
public class File : IModel
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string FileKeyString { get; set; } = string.Empty;
    public int? HorseId { get; set; }
    public Horse? Horse { get; set; }

}
