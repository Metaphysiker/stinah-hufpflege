using System.Security.Claims;

public class TreatmentCategoryFinder
{

    public List<string> GetTreatmentCategoriesForClaims(IEnumerable<Claim> claims)
    {
        List<string> treatmentCategories = new List<string>();

        CareAreas[] careAreas = (CareAreas[])Enum.GetValues(typeof(CareAreas));

        foreach (var claim in claims)
        {
            if (claim.Type == ClaimTypes.Role)
            {
                if (careAreas.Contains((CareAreas)Enum.Parse(typeof(CareAreas), claim.Value)))
                {
                    treatmentCategories.Add(claim.Value);
                }
            }
        }
        return treatmentCategories;
    }
}
