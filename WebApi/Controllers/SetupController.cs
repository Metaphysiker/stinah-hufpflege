using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SetupController : ControllerBase
{
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
        // Create Stinah Role
        var stinahRole = await _roleManager.FindByNameAsync("Stinah");
        if (stinahRole == null)
        {
            stinahRole = new IdentityRole { Name = "Stinah" };
            await _roleManager.CreateAsync(stinahRole);
        }

        // Create Admin Role
        var adminRole = await _roleManager.FindByNameAsync("Admin");
        if (adminRole == null)
        {
            adminRole = new IdentityRole { Name = "Admin" };
            await _roleManager.CreateAsync(adminRole);
        }

        // Create Admin User
        var admin = await _userManager.FindByEmailAsync("s.raess@me.com");
        if (admin != null && adminRole != null && adminRole.Name != null)
        {
            await _userManager.AddToRoleAsync(admin, adminRole.Name);
        }
        else
        {
            admin = new IdentityUser { UserName = "s.raess@me.com", Email = "s.raess@me.com" };
            string? adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");
            if (adminPassword == null)
            {
                adminPassword = "password";
            }
            _userManager.CreateAsync(admin, adminPassword).Wait();
        }
        await _userManager.AddToRoleAsync(admin, "Admin");
        await _userManager.AddToRoleAsync(admin, "Stinah");

        // Create Stinah User
        var stinahuser = await _userManager.FindByEmailAsync("info@stinah.ch");
        if (stinahuser != null && stinahRole != null && stinahRole.Name != null)
        {
            await _userManager.AddToRoleAsync(stinahuser, stinahRole.Name);
        }
        else
        {
            stinahuser = new IdentityUser { UserName = "info@stinah.ch", Email = "info@stinah.ch" };
            string? password = Environment.GetEnvironmentVariable("STINAH_PASSWORD");
            if (password == null)
            {
                password = "password";
            }
            _userManager.CreateAsync(stinahuser, password).Wait();
        }
        await _userManager.AddToRoleAsync(stinahuser, "Stinah");

        return Ok();
    }
}
