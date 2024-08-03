using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HorsesController : ControllerBase
{
    private readonly DatabaseContext _db;

    public HorsesController(DatabaseContext db)
    {
        _db = db;
    }

    [HttpGet]
    public List<Horse> Get()
    {
        return _db.Horses.ToList();
    }

    [HttpGet("protected")]
    [Authorize]
    public List<Horse> ProtectedGet()
    {
        return _db.Horses.ToList();
    }

    [HttpGet("protectedadmin")]
    [Authorize(Roles = "Admin")]
    public List<Horse> ProtectedAdminGet()
    {
        return _db.Horses.ToList();
    }

    [HttpGet("{id}")]
    public ActionResult<Horse> GetById(int id)
    {
        var horse = _db.Horses.Find(id);
        if (horse == null)
        {
            return NotFound();
        }
        return horse;
    }

    [HttpPost]
    public ActionResult<Horse> Post([FromBody] Horse horse)
    {
        _db.Add(horse);
        _db.SaveChanges();
        var createdHorse = _db.Horses.Find(horse.Id);
        if (createdHorse == null)
        {
            return BadRequest();
        }
        return createdHorse;
    }

    [HttpPut]
    public ActionResult<Horse> Put([FromBody] Horse horse)
    {
        _db.Update(horse);
        _db.SaveChanges();
        var updatedHorse = _db.Horses.Find(horse.Id);
        if (updatedHorse == null)
        {
            return BadRequest();
        }
        return updatedHorse;
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var horse = _db.Horses.Find(id);
        if (horse == null)
        {
            return NotFound();
        }

        var treatments = _db.Treatments.Where(t => t.HorseId == id);
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
