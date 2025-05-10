using System.Text.Json;

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

    public HoofCheck convertHoofCheckStringToHoofCheck(string hoofCheckString)
    {
        HoofCheck hoofCheck = new HoofCheck();
        if (hoofCheckString != null)
        {
            var parsedHoofCheck = JsonSerializer.Deserialize<HoofCheck>(hoofCheckString);
            if (parsedHoofCheck != null)
            {
                if (parsedHoofCheck.frontLeft != null)
                {
                    hoofCheck.frontLeft = parsedHoofCheck.frontLeft;
                }
                if (parsedHoofCheck.frontLeftTask != null)
                {
                    hoofCheck.frontLeftTask = parsedHoofCheck.frontLeftTask;
                }
                if (parsedHoofCheck.frontRight != null)
                {
                    hoofCheck.frontRight = parsedHoofCheck.frontRight;
                }
                if (parsedHoofCheck.frontRightTask != null)
                {
                    hoofCheck.frontRightTask = parsedHoofCheck.frontRightTask;
                }
                if (parsedHoofCheck.backLeft != null)
                {
                    hoofCheck.backLeft = parsedHoofCheck.backLeft;
                }
                if (parsedHoofCheck.backLeftTask != null)
                {
                    hoofCheck.backLeftTask = parsedHoofCheck.backLeftTask;
                }
                if (parsedHoofCheck.backRight != null)
                {
                    hoofCheck.backRight = parsedHoofCheck.backRight;
                }
                if (parsedHoofCheck.backRightTask != null)
                {
                    hoofCheck.backRightTask = parsedHoofCheck.backRightTask;
                }
            }
        }
        return hoofCheck;
    }

    public void applyHoofCheckWithInformationOfLastHoofCheck(Treatment currentTreatment, Treatment lastTreatment)
    {
        var dateString = lastTreatment.CreatedAt.ToString("dd.MM.yyyy");
        var infoText = "Kopiert vom letzten Eintrag(" + dateString + "): \n";
        var currentHoofCheck = convertHoofCheckStringToHoofCheck(currentTreatment.HoofCheckString);
        var lastHoofCheck = convertHoofCheckStringToHoofCheck(lastTreatment.HoofCheckString);

        if (lastHoofCheck.frontLeftTask != null && lastHoofCheck.frontLeftTask != string.Empty)
        {
            Console.WriteLine("Front left task: " + lastHoofCheck.frontLeftTask);
            currentHoofCheck.frontLeftTask = infoText + lastHoofCheck.frontLeftTask;
        }
        if (lastHoofCheck.frontRightTask != null && lastHoofCheck.frontRightTask != string.Empty)
        {
            Console.WriteLine("Front right task: " + lastHoofCheck.frontRightTask);
            currentHoofCheck.frontRightTask = infoText + lastHoofCheck.frontRightTask;
        }
        if (lastHoofCheck.backLeftTask != null && lastHoofCheck.backLeftTask != string.Empty)
        {
            Console.WriteLine("Back left task: " + lastHoofCheck.backLeftTask);
            currentHoofCheck.backLeftTask = infoText + lastHoofCheck.backLeftTask;
        }
        if (lastHoofCheck.backRightTask != null && lastHoofCheck.backRightTask != string.Empty)
        {
            Console.WriteLine("Back right task: " + lastHoofCheck.backRightTask);
            currentHoofCheck.backRightTask = infoText + lastHoofCheck.backRightTask;
        }

        currentTreatment.HoofCheckString = JsonSerializer.Serialize(currentHoofCheck);
    }
}
