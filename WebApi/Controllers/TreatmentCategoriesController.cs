using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TreatmentCategoriesController : ControllerBase
{
    private readonly DatabaseContext _db;

    public TreatmentCategoriesController(DatabaseContext db)
    {
        _db = db;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<TreatmentCategory>>> ReadAll()
    {
        if (User.Identity != null && User.Identity.IsAuthenticated)
        {
            Console.WriteLine(User.Identity.Name);

            Console.WriteLine(User.Claims);
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"{claim.Type}: {claim.Value}");
            }
            TreatmentCategoryFinder finder = new TreatmentCategoryFinder();
            var found = finder.GetTreatmentCategoriesForClaims(User.Claims);
            Console.WriteLine("Found treatment categories:");
            foreach (var item in found)
            {
                Console.WriteLine(item);
            }
        }
        else
        {
            Console.WriteLine("User is not authenticated");
        }

        return await _db.TreatmentCategories.ToListAsync();
    }
}
