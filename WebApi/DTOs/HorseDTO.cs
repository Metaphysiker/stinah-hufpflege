public class HorseDTO : IDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int NumberOfWeeksUntilNextTreatment { get; set; } = 0;
    public int BirthYear { get; set; } = 0;
    public string NoteForNextTreatment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool Beschlagen { get; set; } = false;
    public string FileKeysString { get; set; } = string.Empty;
    public DateTime LastTimeTreated { get; set; } = DateTime.UtcNow;
    public ICollection<int> TreatmentIds { get; set; } = new List<int>();
}
