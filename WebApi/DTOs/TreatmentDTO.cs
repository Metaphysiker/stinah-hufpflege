public class TreatmentDTO : IDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public string NoteForNextTreatment { get; set; } = string.Empty;
    public int? HorseId { get; set; }
    public string? HorseName { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string Category { get; set; } = string.Empty;
    public string SubCategory { get; set; } = string.Empty;
    public string HoofCheckString { get; set; } = string.Empty;
    public string HoofCheckStringFromLastTreatment { get; set; } = string.Empty;
    public bool ClearFollowUp1AdvanceNotice { get; set; } = false;
    public bool ClearFollowUp2AdvanceNotice { get; set; } = false;
}
