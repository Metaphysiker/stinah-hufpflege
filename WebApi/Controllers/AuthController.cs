using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly DatabaseContext _db;
    private readonly TokenService _tokenService;
    public AuthController(UserManager<IdentityUser> userManager, DatabaseContext db, TokenService tokenService)
    {
        _userManager = userManager;
        _db = db;
        _tokenService = tokenService;
    }


    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(RegistrationRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var result = await _userManager.CreateAsync(
            new IdentityUser { UserName = request.Username, Email = request.Email },
            request.Password
        );
        if (result.Succeeded)
        {
            request.Password = "";
            return CreatedAtAction(nameof(Register), new { email = request.Email }, request);
        }
        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(error.Code, error.Description);
        }
        return BadRequest(ModelState);
    }

    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<AuthResponse>> Authenticate([FromBody] AuthRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var managedUser = await _userManager.FindByEmailAsync(request.Email);
        if (managedUser == null)
        {
            managedUser = await _userManager.FindByNameAsync(request.Email);

            if (managedUser == null)
            {
                return BadRequest("User not found");
            }
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(managedUser, request.Password);
        if (!isPasswordValid)
        {
            return BadRequest("Login failed");
        }

        var accessToken = await _tokenService.CreateToken(managedUser);
        await _db.SaveChangesAsync();

        return Ok(new AuthResponse
        {
            Username = managedUser.UserName ?? "",
            Email = managedUser.Email ?? "",
            Token = accessToken,
        });
    }

    [HttpGet, Authorize]
    [Route("is-logged-in")]
    public ActionResult<AuthResponse> CheckIfLoggedIn()
    {
        return Ok();
    }
}
