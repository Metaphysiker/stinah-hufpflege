public class RoutineDTO  : IDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public int RhythmInWeeks { get; set; } = 0;
    public string TreatmentCategoryName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int? HorseId { get; set; }
    public string? HorseName { get; set; } = string.Empty;
}
