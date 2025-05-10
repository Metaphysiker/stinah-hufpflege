public class HoofCheck
{
    public string frontLeft { get; set; } = HoofCheckStatuses.Neutral.ToString();
    public string frontLeftTask { get; set; } = string.Empty;
    public string frontRight { get; set; } = HoofCheckStatuses.Neutral.ToString();
    public string frontRightTask { get; set; } = string.Empty;
    public string backLeft { get; set; } = HoofCheckStatuses.Neutral.ToString();
    public string backLeftTask { get; set; } = string.Empty;
    public string backRight { get; set; } = HoofCheckStatuses.Neutral.ToString();
    public string backRightTask { get; set; } = string.Empty;
}
