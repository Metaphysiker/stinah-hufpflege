using System.Net;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class MigrationController : ControllerBase
{
    private readonly DatabaseContext _db;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public MigrationController(DatabaseContext db, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _db = db;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpGet("clean")]
    public async Task<HttpStatusCode> clean()
    {
        var horses = _db.Horses.ToList();
        foreach (var horse in horses)
        {
            _db.Horses.Remove(horse);
        }

        var treatments = _db.Treatments.ToList();
        foreach (var treatment in treatments)
        {
            _db.Treatments.Remove(treatment);
        }

        var files = _db.Files.ToList();
        foreach (var file in files)
        {
            _db.Files.Remove(file);
        }

        await _db.SaveChangesAsync();

        return HttpStatusCode.OK;
    }


    [HttpPost("migrate-hufpflege")]
    public async Task<List<Horse>> migrateHufpflege([FromBody] List<OldHorse> oldHorses)
    {
        await _db.SaveChangesAsync();

        foreach (var oldHorse in oldHorses)
        {
            Horse horse = new Horse();
            horse.Name = oldHorse.Name;
            horse.NumberOfWeeksUntilNextTreatmentHoofcare = oldHorse.NumberOfWeeksUntilNextTreatment;
            horse.BirthYear = oldHorse.BirthYear;
            horse.NoteForNextTreatment = oldHorse.NoteForNextTreatment;
            horse.CreatedAt = oldHorse.CreatedAt;
            horse.UpdatedAt = oldHorse.UpdatedAt;
            horse.Beschlagen = oldHorse.Beschlagen;
            horse.FileKeysString = oldHorse.FileKeysString;
            Console.WriteLine("OldId: " + oldHorse.Id);
            horse.OldId = oldHorse.Id;

            foreach (var fileKeyString in oldHorse.FileKeysString.Split(","))
            {
                File file = new File();
                file.Horse = horse;
                file.HorseId = horse.Id;

                file.FileKeysString = fileKeyString;
                horse.Files.Add(file);
            }

            await _db.AddAsync(horse);
        }

        await _db.SaveChangesAsync();
        return _db.Horses.ToList();
    }

    [HttpPost("migrate-hufpflege-treatments")]
    public async Task<List<Treatment>> migrateHufpflegeTreatments([FromBody] List<OldTreatment> oldTreatments)
    {
        await _db.SaveChangesAsync();

        foreach (var oldTreatment in oldTreatments)
        {

            var foundHorse = _db.Horses.FirstOrDefault(h => h.OldId == oldTreatment.HorseId);

            if (foundHorse == null)
            {
                Console.WriteLine("Horse not found: " + oldTreatment.HorseId);

                continue;
            }

            foreach (var fileKeyString in foundHorse.FileKeysString.Split(","))
            {
                File file = new File();
                file.Horse = foundHorse;
                file.HorseId = foundHorse.Id;
                file.FileKeysString = fileKeyString;
                foundHorse.Files.Add(file);
            }

            Console.WriteLine("Found horse: " + foundHorse.Name);
            var treatment = new Treatment();
            treatment.Note = oldTreatment.Note;
            treatment.NoteForNextTreatment = oldTreatment.NoteForNextTreatment;
            treatment.HorseId = foundHorse.Id;
            treatment.Date = oldTreatment.Date;
            treatment.CreatedAt = oldTreatment.CreatedAt;
            treatment.UpdatedAt = oldTreatment.UpdatedAt;
            treatment.FileKeysString = oldTreatment.FileKeysString;
            treatment.Category = CareAreas.Hoofcare.ToString();
            await _db.AddAsync(treatment);
        }

        await _db.SaveChangesAsync();
        return _db.Treatments.ToList();
    }


    [HttpGet("migrate")]
    public async Task<HttpStatusCode> migrate()
    {

        // Update Hoofcare user password
        var hufPfleger = await _userManager.FindByNameAsync(Roles.Hoofcare.ToString());
        if (hufPfleger != null)
        {
            string? password = Environment.GetEnvironmentVariable("NEW_HOOFCARE_USER_PASSWORD");
            var token = await _userManager.GeneratePasswordResetTokenAsync(hufPfleger);
            var result = await _userManager.ResetPasswordAsync(hufPfleger, token, password!);
            // if fails return error
            if (!result.Succeeded)
            {
                return HttpStatusCode.InternalServerError;
            }
        }

        return HttpStatusCode.OK;
    }

    [HttpGet("migrateOld2")]
    public async Task<HttpStatusCode> migrateOld2()
    {
        var treatments = _db.Treatments.ToList();
        foreach (var treatment in treatments)
        {
            treatment.Category = "hoofcare";
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


    [HttpPost("migrate-zahnpflege")]
    public async Task<List<Horse>> migrateZahnpflege([FromBody] List<OldHorse> oldHorses)
    {
        await _db.SaveChangesAsync();

        foreach (var oldHorse in oldHorses)
        {
            var mainHorse = new Horse();
            var foundHorse = _db.Horses.FirstOrDefault(h => h.Name == oldHorse.Name);
            if (foundHorse != null)
            {
                Console.WriteLine("Horse already exists: " + oldHorse.Name);
                mainHorse = foundHorse;
            }
            else
            {
                Horse horse = new Horse();
                horse.Name = oldHorse.Name;
                horse.NumberOfWeeksUntilNextTreatmentHoofcare = oldHorse.NumberOfWeeksUntilNextTreatment;
                horse.BirthYear = oldHorse.BirthYear;
                horse.NoteForNextTreatment = oldHorse.NoteForNextTreatment;
                horse.CreatedAt = oldHorse.CreatedAt;
                horse.UpdatedAt = oldHorse.UpdatedAt;
                horse.Beschlagen = oldHorse.Beschlagen;
                horse.FileKeysString = oldHorse.FileKeysString;
                Console.WriteLine("OldId: " + oldHorse.Id);
                horse.OldId = oldHorse.Id;
                await _db.AddAsync(horse);
                mainHorse = horse;
            }



            foreach (var fileKeyString in oldHorse.FileKeysString.Split(","))
            {
                File file = new File();
                file.Horse = mainHorse;
                file.HorseId = mainHorse.Id;

                file.FileKeysString = fileKeyString;
                mainHorse.Files.Add(file);
            }

            Treatment treatment = new Treatment();
            treatment.Note = oldHorse.NoteForNextTreatment;
            treatment.NoteForNextTreatment = oldHorse.NoteForNextTreatment;
            treatment.HorseId = mainHorse.Id;
            treatment.Date = oldHorse.LastTimeTreated;
            treatment.CreatedAt = oldHorse.CreatedAt;
            treatment.UpdatedAt = oldHorse.UpdatedAt;
            treatment.FileKeysString = oldHorse.FileKeysString;
            treatment.Category = CareAreas.Toothcare.ToString();
            mainHorse.Treatments.Add(treatment);
        }

        await _db.SaveChangesAsync();
        return _db.Horses.ToList();
    }

}
