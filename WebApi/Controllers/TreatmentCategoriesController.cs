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
}
