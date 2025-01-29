using System.Security.Claims;

public class TreatmentCategoryFinder
{

    public List<string> GetTreatmentCategoriesForClaims(IEnumerable<Claim> claims)
    {
        List<string> treatmentCategories = new List<string>();

        string[] careAreaStrings = Enum.GetNames(typeof(CareAreas));

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
