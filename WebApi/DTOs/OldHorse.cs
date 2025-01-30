public class OldHorse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string LastTimeTreated { get; set; } = string.Empty;
    public int NumberOfWeeksUntilNextTreatment { get; set; }
    public int BirthYear { get; set; }
    public string NoteForNextTreatment { get; set; } = string.Empty;
    public List<object> Horses { get; set; } = new List<object>();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool Beschlagen { get; set; }
    public string FileKeysString { get; set; } = string.Empty;
}

