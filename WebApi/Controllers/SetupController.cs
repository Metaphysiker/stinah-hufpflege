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

    [HttpGet("CreateAdmin")]
    public async Task<ActionResult<IdentityUser>> CreateAdmin()
    {
        var adminRole = await _roleManager.FindByNameAsync("Admin");
        if (adminRole == null)
        {
            adminRole = new IdentityRole { Name = "Admin" };
            await _roleManager.CreateAsync(adminRole);
        }

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

        return admin;
    }
}
