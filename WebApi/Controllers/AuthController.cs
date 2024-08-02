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
            return BadRequest("User not found");
        }
        var isPasswordValid = await _userManager.CheckPasswordAsync(managedUser, request.Password);
        if (!isPasswordValid)
        {
            return BadRequest("Login failed");
        }
        var userInDb = _db.Users.FirstOrDefault(u => u.Email == request.Email);
        if (userInDb is null)
            return Unauthorized();
        var accessToken = await _tokenService.CreateToken(userInDb);
        await _db.SaveChangesAsync();

        if (userInDb.UserName == null)
        {
            return BadRequest("No Username");
        }

        if (userInDb.Email == null)
        {
            return BadRequest("No Email");
        }

        return Ok(new AuthResponse
        {
            Username = userInDb.UserName,
            Email = userInDb.Email,
            Token = accessToken,
        });
    }

    [HttpGet, Authorize]
    [Route("check-if-logged-in")]
    public ActionResult<AuthResponse> CheckIfLoggedIn()
    {
        return Ok();
    }
}
