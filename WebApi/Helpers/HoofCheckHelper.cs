public class HoofCheckHelper
{
    public string GetSummaryHoofCheckStatusOfLastTreatment(Horse horse)
    {
        var lastTreatment = horse.Treatments
            .OrderByDescending(t => t.Date)
            .FirstOrDefault();
        if (lastTreatment != null)
        {

            if (lastTreatment.HoofCheckString.Contains("NotOkay"))
            {
                return "NotOkay";
            }
            return "Okay";
        }
        return string.Empty;
    }
}
