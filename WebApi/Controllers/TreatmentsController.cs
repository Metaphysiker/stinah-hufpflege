using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Authorize(Roles = "Admin, Stinah")]
[ApiController]
[Route("api/[controller]")]
public class TreatmentsController : ControllerBase
{
    private readonly TreatmentDTOConverter _treatmentDTOConverter;
    private readonly DatabaseContext _db;

    public TreatmentsController(DatabaseContext db, TreatmentDTOConverter treatmentDTOConverter)
    {
        _treatmentDTOConverter = treatmentDTOConverter;
        _db = db;
    }

    [HttpGet]
    public List<TreatmentDTO> Get()
    {
        var treatments = _db.Treatments.ToList();
        return _treatmentDTOConverter.Convert(treatments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TreatmentDTO>> GetById(int id)
    {
        var treatment = await _db.Treatments.FindAsync(id);
        if (treatment == null)
        {
            return NotFound();
        }
        return _treatmentDTOConverter.Convert(treatment);
    }

    [HttpPost]
    public async Task<ActionResult<TreatmentDTO>> Post([FromBody] TreatmentDTO treatmentDto)
    {
        var treatment = _treatmentDTOConverter.Convert(treatmentDto);

        await _db.AddAsync(treatment);
        await _db.SaveChangesAsync();

        var createdTreatment = await _db.Treatments.FindAsync(treatment.Id);
        if (createdTreatment == null)
        {
            return BadRequest();
        }

        return _treatmentDTOConverter.Convert(createdTreatment);
    }

    [HttpPut]
    public ActionResult<TreatmentDTO> Put([FromBody] TreatmentDTO treatmentDto)
    {
        var treatment = _treatmentDTOConverter.Convert(treatmentDto);
        _db.Update(treatment);
        _db.SaveChanges();
        var updatedTreatment = _db.Treatments.Find(treatment.Id);
        if (updatedTreatment == null)
        {
            return BadRequest();
        }
        return _treatmentDTOConverter.Convert(updatedTreatment);
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
    public List<TreatmentDTO> Search([FromBody] TreatmentSearch search)
    {
        var query = _db.Treatments.AsQueryable();

        if (search.HorseId != null)
        {
            query = query.Where(t => t.Horse != null && t.Horse.Id == search.HorseId);
        }

        if (search.Categories.Count > 0)
        {
            query = query.Where(t => search.Categories.Contains(t.Category));
        }

        var results = query
            .Skip(search.Page * search.PageSize)
            .Take(search.PageSize)
            .ToList();

        return _treatmentDTOConverter.Convert(results);
    }
}
