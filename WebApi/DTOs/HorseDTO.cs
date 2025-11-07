using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

public class HorseDTO : IDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int BirthYear { get; set; } = 0;
    public string NoteForNextTreatment { get; set; } = string.Empty;
    public int NumberOfWeeksUntilNextTreatmentHoofcare { get; set; } = 0;
    public int NumberOfWeeksUntilNextTreatmentHoofcareFollowUp1 { get; set; } = 0;
    public string FollowUp1AdvanceNotice { get; set; } = string.Empty;
    public int NumberOfWeeksUntilNextTreatmentHoofcareFollowUp2 { get; set; } = 0;
    public string FollowUp2AdvanceNotice { get; set; } = string.Empty;
    public int NumberOfWeeksUntilNextTreatmentToothcare { get; set; } = 0;
    public int NumberOfWeeksUntilNextTreatmentHealthcare { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool Beschlagen { get; set; } = false;
    public string FileKeysString { get; set; } = string.Empty;
    public DateTime LastTimeTreated { get; set; } = DateTime.UtcNow;
    public ICollection<int> TreatmentIds { get; set; } = new List<int>();
    public ICollection<int> FileIds { get; set; } = new List<int>();
    public ICollection<int> RoutineIds { get; set; } = new List<int>();
    [ValidateNever]
    public ICollection<Routine> IncludedRoutines { get; set; } = new List<Routine>();
    public ICollection<TreatmentDate> TreatmentDates { get; set; } = new List<TreatmentDate>();
    public string Patenschaften { get; set; } = string.Empty;
    public string SummaryHoofCheckStatusOfLastTreatment { get; set; } = string.Empty;
    public string WorkOnHoof { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}
