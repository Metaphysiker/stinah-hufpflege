public class PaginationDTO<T>
{
    public List<T> Data { get; set; } = new List<T>();
    public int Page { get; set; } = 0;
    public int PageSize { get; set; } = 20;
    public int TotalPages { get; set; } = 0;
    public int TotalItems { get; set; } = 0;
}
