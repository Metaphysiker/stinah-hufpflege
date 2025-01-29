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

    [AllowAnonymous]
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<TreatmentCategory>>> ReadAll()
    {
        if (User.Identity != null && User.Identity.IsAuthenticated)
        {
            TreatmentCategoryFinder finder = new TreatmentCategoryFinder();
            var treatmentCategoriesForUser = finder.GetTreatmentCategoriesForClaims(User.Claims);
            var query = _db.TreatmentCategories.Where(tc => treatmentCategoriesForUser.Contains(tc.Name));
            return await query.ToListAsync();
        }
        else
        {
            return new List<TreatmentCategory>();
        }

    }
}
