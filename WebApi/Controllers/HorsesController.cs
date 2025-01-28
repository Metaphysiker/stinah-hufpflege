using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Controllers;

[Authorize(Roles = "RegularUser")]
[ApiController]
[Route("api/[controller]")]
public class HorsesController : ControllerBase, IModelController<HorseDTO, HorseSearch>
{
    private readonly DatabaseContext _db;
    private readonly HorseDTOConverter _horseDTOConveter;

    public HorsesController(DatabaseContext db, HorseDTOConverter horseDTOConveter)
    {
        _db = db;
        _horseDTOConveter = horseDTOConveter;
    }

    [HttpGet("protected")]
    [Authorize]
    public List<HorseDTO> ProtectedGet()
    {
        var horses = _db.Horses.ToList();
        return _horseDTOConveter.Convert(horses);
    }

    [HttpGet("protectedadmin")]
    [Authorize(Roles = "Admin")]
    public List<HorseDTO> ProtectedAdminGet()
    {
        var horses = _db.Horses.ToList();

        return _horseDTOConveter.Convert(horses);
    }

    [HttpGet("CreateHorses")]
    public string CreateHorses()
    {
        _db.Add(new Horse { Name = "Polly" });
        _db.SaveChanges();
        return "Created";
    }

    [HttpGet("env")]
    public string GetEnv()
    {
        return "success";
    }

    [HttpGet]
    public async Task<ActionResult<List<HorseDTO>>> ReadAll()
    {
        var horses = await _db.Horses.Include(a => a.Treatments)
        .Include(a => a.Files).ToListAsync();

        return _horseDTOConveter.Convert(horses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HorseDTO>> Read(int id)
    {
        var horse = await _db.Horses.FindAsync(id);
        if (horse == null)
        {
            return NotFound();
        }

        return _horseDTOConveter.Convert(horse);
    }

    [HttpPost]
    public async Task<ActionResult<HorseDTO>> Create([FromBody] HorseDTO dto)
    {
        var horse = _horseDTOConveter.Convert(dto);
        await _db.AddAsync(horse);
        await _db.SaveChangesAsync();
        var createdHorse = await _db.Horses.FindAsync(horse.Id);
        if (createdHorse == null)
        {
            return BadRequest();
        }
        return _horseDTOConveter.Convert(createdHorse);
    }

    [HttpPut]
    public async Task<ActionResult<HorseDTO>> Update([FromBody] HorseDTO dto)
    {
        var horse = _horseDTOConveter.Convert(dto);
        _db.Update(horse);
        await _db.SaveChangesAsync();
        var updatedHorse = await _db.Horses.FindAsync(horse.Id);
        if (updatedHorse == null)
        {
            return BadRequest();
        }
        return _horseDTOConveter.Convert(updatedHorse);
    }

    [HttpDelete("{id}")]

    public async Task<ActionResult> Delete(int id)
    {
        var horse = await _db.Horses.FindAsync(id);
        if (horse == null)
        {
            return NotFound();
        }

        var treatments = _db.Treatments.Where(t => t.Horse != null && t.Horse.Id == id);
        _db.RemoveRange(treatments);

        _db.Remove(horse);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("search")]
    public async Task<ActionResult<PaginationDTO<HorseDTO>>> Search([FromBody] HorseSearch search)
    {
        var query = _db.Horses.AsQueryable();

        if (search.Ids.Count > 0)
        {
            query = query.Where(t => search.Ids.Contains(t.Id));
        }

        PaginationDTO<HorseDTO> paginationDTO = new PaginationDTO<HorseDTO>();
        paginationDTO.TotalItems = await query.CountAsync();

        var results = await query
            .Skip(search.Page * search.PageSize)
            .Take(search.PageSize)
            .Include(a => a.Treatments)
            .Include(a => a.Files)
            .ToListAsync();

        paginationDTO.TotalPages = (int)Math.Ceiling((double)paginationDTO.TotalItems / search.PageSize);
        paginationDTO.Page = search.Page;
        paginationDTO.Data = _horseDTOConveter.Convert(results);
        return paginationDTO;
    }
}
