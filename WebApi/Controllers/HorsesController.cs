using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Controllers;

[Authorize(Roles = "Admin, Stinah")]
[ApiController]
[Route("api/[controller]")]
public class HorsesController : ControllerBase
{
    private readonly DatabaseContext _db;
    private readonly HorseDTOConveter _horseDTOConveter;

    public HorsesController(DatabaseContext db, HorseDTOConveter horseDTOConveter)
    {
        _db = db;
        _horseDTOConveter = horseDTOConveter;
    }

    [HttpGet]
    public async Task<List<HorseDTO>> Get()
    {
        var horses = await _db.Horses.Include(a => a.Treatments).ToListAsync();
        return _horseDTOConveter.Convert(horses);
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

    [HttpGet("{id}")]
    public ActionResult<HorseDTO> GetById(int id)
    {
        var horse = _db.Horses.Find(id);
        if (horse == null)
        {
            return NotFound();
        }

        return _horseDTOConveter.Convert(horse);
    }

    [HttpPost]
    public ActionResult<HorseDTO> Post([FromBody] Horse horse)
    {
        _db.Add(horse);
        _db.SaveChanges();
        var createdHorse = _db.Horses.Find(horse.Id);
        if (createdHorse == null)
        {
            return BadRequest();
        }
        return _horseDTOConveter.Convert(createdHorse);
    }

    [HttpPut]
    public ActionResult<HorseDTO> Put([FromBody] HorseDTO horseDTO)
    {
        var horse = _horseDTOConveter.Convert(horseDTO);
        _db.Update(horse);
        _db.SaveChanges();
        var updatedHorse = _db.Horses.Find(horse.Id);
        if (updatedHorse == null)
        {
            return BadRequest();
        }
        return _horseDTOConveter.Convert(updatedHorse);
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var horse = _db.Horses.Find(id);
        if (horse == null)
        {
            return NotFound();
        }

        var treatments = _db.Treatments.Where(t => t.Horse != null && t.Horse.Id == id);
        _db.RemoveRange(treatments);

        _db.Remove(horse);
        _db.SaveChanges();
        return NoContent();
    }

    [HttpGet("CreateHorses")]
    public string CreateHorses()
    {
        Console.WriteLine("Inserting a new Horse");
        _db.Add(new Horse { Name = "Polly" });
        _db.SaveChanges();
        return "Created";
    }

    [HttpGet("env")]
    public string GetEnv()
    {
        return "success";
    }
}
