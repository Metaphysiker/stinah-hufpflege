public class Horse : IModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime LastTimeTreated { get; set; } = DateTime.Now;
    public int NumberOfWeeksUntilNextTreatment { get; set; } = 0;
    public int BirthYear { get; set; } = 0;
}
