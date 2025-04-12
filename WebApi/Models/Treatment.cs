public class Treatment : IModel, IEnityWithFiles
{
    public int Id { get; set; }
    public string Note { get; set; } = string.Empty;
    public string NoteForNextTreatment { get; set; } = string.Empty;
    public int? HorseId { get; set; }
    public Horse? Horse { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string Category { get; set; } = string.Empty;
    public string FileKeysString { get; set; } = string.Empty;
    public ICollection<File> Files { get; set; } = new List<File>();
    public string HoofCheckString { get; set; } = string.Empty;
}
