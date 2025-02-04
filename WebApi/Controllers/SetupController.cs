using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SetupController : ControllerBase
{
    /*
        Every User has the role "RegularUser" by default.
        The roles "Admin", "Hoofcare", "Toothcare" and "Healthcare" are special roles.
    */
    private readonly DatabaseContext _db;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public SetupController(DatabaseContext db, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _db = db;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpGet]
    public List<IdentityUser> Get()
    {
        return _db.Users.ToList();
    }

    [HttpGet("setup")]
    public async Task<ActionResult> Setup()
    {
        await CreateTreatmentCategories();
        await CreateRoles();
        await CreateAdminUser();
        await CreateStinahUser();
        await CreateHoofcareUser();
        await CreateToothcareUser();
        await CreateHealthcareUser();
        await CreateMovementcareUser();
        return Ok();
    }

    private async Task CreateRoles()
    {
        Roles[] roles = (Roles[])Enum.GetValues(typeof(Roles));
        foreach (var role in roles)
        {
            var found = await _roleManager.FindByNameAsync(role.ToString());
            if (found == null)
            {
                var identityRole = new IdentityRole { Name = role.ToString() };
                await _roleManager.CreateAsync(identityRole);
            }
        }
    }

    private async Task CreateAdminUser()
    {
        var admin = await _userManager.FindByNameAsync(Roles.Admin.ToString());
        if (admin == null)
        {
            admin = new IdentityUser { UserName = Roles.Admin.ToString() };
            string? password = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");
            await _userManager.CreateAsync(admin, password!);
        }

        await _userManager.AddToRoleAsync(admin, Roles.Admin.ToString());
        await _userManager.AddToRoleAsync(admin, Roles.RegularUser.ToString());
        await _userManager.AddToRoleAsync(admin, Roles.Hoofcare.ToString());
        await _userManager.AddToRoleAsync(admin, Roles.Toothcare.ToString());
        await _userManager.AddToRoleAsync(admin, Roles.Healthcare.ToString());
        await _userManager.AddToRoleAsync(admin, Roles.Movementcare.ToString());
    }

    private async Task CreateStinahUser()
    {
        var user = await _userManager.FindByNameAsync("Stinah");
        if (user == null)
        {
            user = new IdentityUser { UserName = "Stinah", Email = "info@stinah.ch" };
            string? password = Environment.GetEnvironmentVariable("STINAH_PASSWORD");
            await _userManager.CreateAsync(user, password!);
        }

        await _userManager.AddToRoleAsync(user, Roles.RegularUser.ToString());
        await _userManager.AddToRoleAsync(user, Roles.Hoofcare.ToString());
        await _userManager.AddToRoleAsync(user, Roles.Toothcare.ToString());
        await _userManager.AddToRoleAsync(user, Roles.Healthcare.ToString());
        await _userManager.AddToRoleAsync(user, Roles.Movementcare.ToString());
    }

    private async Task CreateHoofcareUser()
    {
        var user = await _userManager.FindByNameAsync(Roles.Hoofcare.ToString());
        if (user == null)
        {
            user = new IdentityUser { UserName = Roles.Hoofcare.ToString() };
            string? password = Environment.GetEnvironmentVariable("REGULAR_USER_PASSWORD");
            await _userManager.CreateAsync(user, password!);
        }

        await _userManager.AddToRoleAsync(user, Roles.RegularUser.ToString());
        await _userManager.AddToRoleAsync(user, Roles.Hoofcare.ToString());
    }

    private async Task CreateToothcareUser()
    {
        var user = await _userManager.FindByNameAsync(Roles.Toothcare.ToString());
        if (user == null)
        {
            user = new IdentityUser { UserName = Roles.Toothcare.ToString() };
            string? password = Environment.GetEnvironmentVariable("REGULAR_USER_PASSWORD");
            await _userManager.CreateAsync(user, password!);
        }

        await _userManager.AddToRoleAsync(user, Roles.RegularUser.ToString());
        await _userManager.AddToRoleAsync(user, Roles.Toothcare.ToString());
    }

    private async Task CreateHealthcareUser()
    {
        var user = await _userManager.FindByNameAsync(Roles.Healthcare.ToString());
        if (user == null)
        {
            user = new IdentityUser { UserName = Roles.Healthcare.ToString() };
            string? password = Environment.GetEnvironmentVariable("REGULAR_USER_PASSWORD");
            await _userManager.CreateAsync(user, password!);
        }

        await _userManager.AddToRoleAsync(user, Roles.RegularUser.ToString());
        await _userManager.AddToRoleAsync(user, Roles.Healthcare.ToString());
    }

    private async Task CreateMovementcareUser()
    {
        var user = await _userManager.FindByNameAsync(Roles.Movementcare.ToString());
        if (user == null)
        {
            user = new IdentityUser { UserName = Roles.Movementcare.ToString() };
            string? password = Environment.GetEnvironmentVariable("REGULAR_USER_PASSWORD");
            await _userManager.CreateAsync(user, password!);
        }

        await _userManager.AddToRoleAsync(user, Roles.RegularUser.ToString());
        await _userManager.AddToRoleAsync(user, Roles.Movementcare.ToString());
    }

    private async Task CreateTreatmentCategories()
    {

        CareAreas[] careAreas = (CareAreas[])Enum.GetValues(typeof(CareAreas));
        foreach (var careArea in careAreas)
        {
            var found = await _db.TreatmentCategories.FirstOrDefaultAsync(a => a.Name == careArea.ToString());
            if (found == null)
            {
                var treatmentCategory = new TreatmentCategory { Name = careArea.ToString() };
                await _db.AddAsync(treatmentCategory);
            }
        }
        await _db.SaveChangesAsync();
    }
}
