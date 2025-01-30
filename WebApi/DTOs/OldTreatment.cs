public class OldTreatment
{
    public int Id { get; set; }
    public string Note { get; set; } = string.Empty;
    public string NoteForNextTreatment { get; set; } = string.Empty;
    public int HorseId { get; set; }
    public DateTime Date { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string FileKeysString { get; set; } = string.Empty;
}
