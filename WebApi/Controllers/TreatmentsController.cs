using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Authorize(Roles = "Admin, Stinah")]
[ApiController]
[Route("api/[controller]")]
public class TreatmentsController : ControllerBase
{
    private readonly DatabaseContext _db;

    public TreatmentsController(DatabaseContext db)
    {
        _db = db;
    }

    [HttpGet]
    public List<Treatment> Get()
    {
        return _db.Treatments.ToList(); ;
    }

    [HttpGet("{id}")]
    public ActionResult<Treatment> GetById(int id)
    {
        var treatment = _db.Treatments.Find(id);
        if (treatment == null)
        {
            return NotFound();
        }
        return treatment;
    }

    [HttpPost]
    public ActionResult<Treatment> Post([FromBody] Treatment treatment)
    {
        _db.Add(treatment);
        _db.SaveChanges();
        var createdTreatment = _db.Treatments.Find(treatment.Id);
        if (createdTreatment == null)
        {
            return BadRequest();
        }
        return createdTreatment;
    }

    [HttpPut]
    public ActionResult<Treatment> Put([FromBody] Treatment treatment)
    {
        _db.Update(treatment);
        _db.SaveChanges();
        var updatedTreatment = _db.Treatments.Find(treatment.Id);
        if (updatedTreatment == null)
        {
            return BadRequest();
        }
        return updatedTreatment;
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var treatment = _db.Treatments.Find(id);
        if (treatment == null)
        {
            return NotFound();
        }
        _db.Remove(treatment);
        _db.SaveChanges();
        return NoContent();
    }

    [HttpPost("search")]
    public List<Treatment> Search([FromBody] TreatmentSearch search)
    {
        return _db.Treatments
            .Where(t => t.Horse != null && t.Horse.Id == search.HorseId)
            .Skip(search.Page * search.PageSize)
            .Take(search.PageSize)
            .ToList();
    }
}
