public class TreatmentSearch
{
    public int? HorseId { get; set; }
    public List<string> Categories { get; set; } = new List<string>();
    public int Page { get; set; } = 0;
    public int PageSize { get; set; } = 10;
}
