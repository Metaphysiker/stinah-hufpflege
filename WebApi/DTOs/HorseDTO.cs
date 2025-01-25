public class HorseDTO : IDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int BirthYear { get; set; } = 0;
    public string NoteForNextTreatment { get; set; } = string.Empty;
    public int NumberOfWeeksUntilNextTreatmentHoofcare { get; set; } = 0;
    public int NumberOfWeeksUntilNextTreatmentToothcare { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool Beschlagen { get; set; } = false;
    public string FileKeysString { get; set; } = string.Empty;
    public DateTime LastTimeTreated { get; set; } = DateTime.UtcNow;
    public ICollection<int> TreatmentIds { get; set; } = new List<int>();
    public ICollection<int> FileIds { get; set; } = new List<int>();
    public ICollection<TreatmentDate> TreatmentDates { get; set; } = new List<TreatmentDate>();
}
