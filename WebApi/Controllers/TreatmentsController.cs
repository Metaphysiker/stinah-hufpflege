using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Controllers;

[Authorize(Roles = "Admin, Stinah")]
[ApiController]
[Route("api/[controller]")]
public class TreatmentsController : ControllerBase, IModelController<TreatmentDTO, TreatmentSearch>
{
    private readonly TreatmentDTOConverter _treatmentDTOConverter;
    private readonly DatabaseContext _db;

    public TreatmentsController(DatabaseContext db, TreatmentDTOConverter treatmentDTOConverter)
    {
        _treatmentDTOConverter = treatmentDTOConverter;
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<TreatmentDTO>>> ReadAll()
    {
        var treatments = await _db.Treatments.ToListAsync();
        return _treatmentDTOConverter.Convert(treatments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TreatmentDTO>> Read(int id)
    {
        var treatment = await _db.Treatments.FindAsync(id);
        if (treatment == null)
        {
            return NotFound();
        }
        return _treatmentDTOConverter.Convert(treatment);
    }

    [HttpPost]
    public async Task<ActionResult<TreatmentDTO>> Create([FromBody] TreatmentDTO treatmentDto)
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
    public async Task<ActionResult<TreatmentDTO>> Update([FromBody] TreatmentDTO treatmentDto)
    {
        var treatment = _treatmentDTOConverter.Convert(treatmentDto);
        _db.Update(treatment);
        await _db.SaveChangesAsync();
        var updatedTreatment = _db.Treatments.Find(treatment.Id);
        if (updatedTreatment == null)
        {
            return BadRequest();
        }
        return _treatmentDTOConverter.Convert(updatedTreatment);
    }

    [HttpDelete("{id}")]

    public async Task<ActionResult> Delete(int id)
    {
        var treatment = await _db.Treatments.FindAsync(id);
        if (treatment == null)
        {
            return NotFound();
        }
        _db.Remove(treatment);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("search")]

    public async Task<ActionResult<List<TreatmentDTO>>> Search([FromBody] TreatmentSearch search)
    {
        var query = _db.Treatments.AsQueryable();

        if (search.Ids.Count > 0)
        {
            query = query.Where(t => search.Ids.Contains(t.Id));
        }

        if (search.HorseId != null)
        {
            query = query.Where(t => t.Horse != null && t.Horse.Id == search.HorseId);
        }

        if (search.Categories.Count > 0)
        {
            query = query.Where(t => search.Categories.Contains(t.Category));
        }

        if (search.SortBy != null && search.SortBy == "Date")
        {
            query = query.OrderBy(t => t.Date);

            if (search.SortOrder != null && search.SortOrder == "descending")
            {
                query = query.Reverse();
            }
        }



        var results = await query
            .Skip(search.Page * search.PageSize)
            .Take(search.PageSize)
            .ToListAsync();

        return _treatmentDTOConverter.Convert(results);
    }
}
