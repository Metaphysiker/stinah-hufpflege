using System.Security.Claims;

public class TreatmentCategoryFinder
{

    public List<string> GetTreatmentCategoriesForClaims(IEnumerable<Claim> claims)
    {
        Console.WriteLine("TreatmentCategoryFinder.GetTreatmentCategoriesForClaims");
        Console.WriteLine("Claims:");
        foreach (var claim in claims)
        {
            Console.WriteLine($"{claim.Type}: {claim.Value}");
        }
        List<string> treatmentCategories = new List<string>();

        string[] careAreaStrings = Enum.GetNames(typeof(CareAreas));
        Console.WriteLine("CareAreas:");
        foreach (var careArea in careAreaStrings)
        {
            Console.WriteLine(careArea);
        }

        foreach (var claim in claims)
        {
            if (claim.Type == ClaimTypes.Role)
            {
                if (careAreaStrings.Contains(claim.Value))
                {
                    treatmentCategories.Add(claim.Value);
                }
            }
        }
        return treatmentCategories;
    }
}
