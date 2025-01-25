public class FileSearch : ISearch
{
    public int Page { get; set; } = 0;
    public int PageSize { get; set; } = 10;
    public List<int> Ids { get; set; } = new List<int>();
    public int? HorseId { get; set; }
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; }
}
