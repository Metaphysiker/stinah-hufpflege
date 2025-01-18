public class PaginationDTO<T>
{
    List<T> Data { get; set; } = new List<T>();
    int Page { get; set; } = 0;
    int PageSize { get; set; } = 20;
    int TotalPages { get; set; } = 0;
}
