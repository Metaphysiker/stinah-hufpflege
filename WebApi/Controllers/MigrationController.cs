using System.Net;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class MigrationController : ControllerBase
{
    private readonly DatabaseContext _db;

    public MigrationController(DatabaseContext db)
    {
        _db = db;
    }


    [HttpGet("migrate")]
    public async Task<HttpStatusCode> migrate()
    {
        var treatments = _db.Treatments.ToList();
        foreach (var treatment in treatments)
        {
            treatment.Category = "hoof";
        }

        await _db.SaveChangesAsync();

        return HttpStatusCode.OK;
    }

    [HttpGet("migrateOld")]
    public async Task<HttpStatusCode> migrateOld()
    {
        var treatments = _db.Treatments.ToList();
        foreach (var treatment in treatments)
        {
            treatment.Date = treatment.CreatedAt;
        }

        await _db.SaveChangesAsync();

        return HttpStatusCode.OK;
    }

}
