public class Treatment : IModel
{
    public int Id { get; set; }
    public string Note { get; set; } = string.Empty;
    public string NoteForNextTreatment { get; set; } = string.Empty;
    public int? HorseId { get; set; }
    public Horse? Horse { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
    public string Category { get; set; } = string.Empty;
    public string FileKeysString { get; set; } = string.Empty;

}
