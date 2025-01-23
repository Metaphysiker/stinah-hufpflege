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

    [HttpGet]
    public async Task<ActionResult<List<TreatmentCategory>>> ReadAll()
    {
        return await _db.TreatmentCategories.ToListAsync();
    }

    [HttpGet("setup")]
    public async Task<ActionResult<List<TreatmentCategory>>> Setup()
    {
        List<String> list = ["general", "hoofcare", "toothcare"];
        foreach (var item in list)
        {
            var found = await _db.TreatmentCategories.FirstOrDefaultAsync(a => a.Name == item);
            if (found == null)
            {
                var treatmentCategory = new TreatmentCategory { Name = item };
                await _db.AddAsync(treatmentCategory);
            }
        }
        await _db.SaveChangesAsync();
        return await _db.TreatmentCategories.ToListAsync();
    }

}
