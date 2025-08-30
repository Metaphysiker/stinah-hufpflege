using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Controllers;

[Authorize(Roles = "RegularUser")]
[ApiController]
[Route("api/[controller]")]
public class RoutinesController : ControllerBase, IModelController<RoutineDTO, RoutineSearch>
{
    private readonly RoutineDTOConverter _routineDTOConverter;
    private readonly DatabaseContext _db;

    public RoutinesController(DatabaseContext db, RoutineDTOConverter routineDTOConverter)
    {
        _routineDTOConverter = routineDTOConverter;
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<RoutineDTO>>> ReadAll()
    {
        var routines = await _db.Routines.ToListAsync();
        return _routineDTOConverter.Convert(routines);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoutineDTO>> Read(int id)
    {
        var routine = await _db.Routines.FindAsync(id);
        if (routine == null)
        {
            return NotFound();
        }
        return _routineDTOConverter.Convert(routine);
    }

    [HttpPost]
    public async Task<ActionResult<RoutineDTO>> Create([FromBody] RoutineDTO routineDto)
    {
        var routine = _routineDTOConverter.Convert(routineDto);

        await _db.AddAsync(routine);
        await _db.SaveChangesAsync();

        var createdRoutine = await _db.Routines.FindAsync(routine.Id);
        if (createdRoutine == null)
        {
            return BadRequest();
        }

        return _routineDTOConverter.Convert(createdRoutine);
    }

    [HttpPut]
    public async Task<ActionResult<RoutineDTO>> Update([FromBody] RoutineDTO routineDto)
    {
        var routine = _routineDTOConverter.Convert(routineDto);
        _db.Update(routine);
        await _db.SaveChangesAsync();
        var updatedRoutine = _db.Routines.Find(routine.Id);
        if (updatedRoutine == null)
        {
            return BadRequest();
        }
        return _routineDTOConverter.Convert(updatedRoutine);
    }

    [HttpDelete("{id}")]

    public async Task<ActionResult> Delete(int id)
    {
        var routine = await _db.Routines.FindAsync(id);
        if (routine == null)
        {
            return NotFound();
        }
        _db.Remove(routine);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("search")]

    public async Task<ActionResult<PaginationDTO<RoutineDTO>>> Search([FromBody] RoutineSearch search)
    {
        var query = _db.Routines.Include(t => t.Horse).AsQueryable();

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
            query = query.Where(t => search.Categories.Contains(t.TreatmentCategoryName));
        }

        if (search.SortBy != null)
        {
            if (search.SortBy == "Date")
            {
                query = query.OrderBy(t => t.Date);
            }

            if (search.SortBy == "Note")
            {
                query = query.OrderBy(t => t.Note);
            }

            if (search.SortBy == "Category")
            {
                query = query.OrderBy(t => t.TreatmentCategoryName);
            }

            if (search.SortOrder != null && search.SortOrder == "descending")
            {
                query = query.Reverse();
            }
        }

        PaginationDTO<RoutineDTO> paginationDTO = new PaginationDTO<RoutineDTO>();
        paginationDTO.TotalItems = await query.CountAsync();

        var results = await query
            .Skip(search.Page * search.PageSize)
            .Take(search.PageSize)
            .ToListAsync();

        paginationDTO.TotalPages = (int)Math.Ceiling((double)paginationDTO.TotalItems / search.PageSize);
        paginationDTO.Page = search.Page;
        paginationDTO.Data = _routineDTOConverter.Convert(results);
        return paginationDTO;
    }
}
