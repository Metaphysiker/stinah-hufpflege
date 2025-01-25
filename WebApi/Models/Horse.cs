public class Horse : IModel, IEnityWithTreatments, IEnityWithFiles
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int NumberOfWeeksUntilNextTreatmentHoofcare { get; set; } = 0;
    public int NumberOfWeeksUntilNextTreatmentToothcare { get; set; } = 0;
    public int BirthYear { get; set; } = 0;
    public string NoteForNextTreatment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool Beschlagen { get; set; } = false;
    public string FileKeysString { get; set; } = string.Empty;
    public ICollection<Treatment> Treatments { get; set; } = new List<Treatment>();
    public ICollection<File> Files { get; set; } = new List<File>();
    public string Patenschaften { get; set; } = string.Empty;
}
