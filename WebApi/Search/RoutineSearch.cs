public class RoutineSearch : ISearch
{
    public int? HorseId { get; set; }
    public List<string> Categories { get; set; } = new List<string>();
    public int Page { get; set; } = 0;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; }
    public List<int> Ids { get; set; } = new List<int>();

}
