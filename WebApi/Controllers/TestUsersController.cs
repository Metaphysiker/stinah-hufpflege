using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

// This controller is intended for testing environments only.
// It is wrapped in a conditional compilation directive (#if DEBUG)
// to ensure it is only compiled and available when the project is built in Debug configuration.
// For production (Release) builds, this controller will not be included.
// If you have a custom "Testing" build configuration, you can use #if TESTING instead,
// and define the 'TESTING' symbol in your .csproj file for that configuration.
#if DEBUG

[ApiController]
[Route("api/test-users")] // A distinct route to clearly mark as test-specific
[ApiExplorerSettings(IgnoreApi = true)] // Hide from Swagger/OpenAPI documentation
public class TestUsersController : ControllerBase
{
    // DTO for the request body to create a test user
    public class CreateTestUserRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }

    // DTO for the response body after creating a test user
    public class CreateTestUserResponse
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }

    [HttpPost("create-user")]
    public async Task<ActionResult<CreateTestUserResponse>> CreateTestUser([FromBody] CreateTestUserRequest request)
    {
        // In a real application, you would interact with your user management service/repository here.
        // For this testing example, we simulate user creation by generating a unique ID.
        var newUserId = Guid.NewGuid().ToString();

        Console.WriteLine($"[TestController] Created test user: Username={request.Username}, Email={request.Email}, UserId={newUserId}");

        return Ok(new CreateTestUserResponse
        {
            UserId = newUserId,
            Username = request.Username,
            Email = request.Email,
            Message = $"Test user '{request.Username}' created successfully."
        });
    }
}

#endif
