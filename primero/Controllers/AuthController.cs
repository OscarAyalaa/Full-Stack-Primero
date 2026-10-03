using ControlAPI.Data;
using ControlAPI.Dtos;
using ControlAPI.Models;
using ControlAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BcryptNet = BCrypt.Net.BCrypt;    //addmanually

namespace ControlAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController: ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User request)
        {
            if(await _context.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest("El usuario ya existe");
            
            var newUser = new User
            {
                Username = request.Username,
                PasswordHash = BcryptNet.HashPassword(request.PasswordHash),
                Role = request.Role ?? "User"
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado correctamente.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if(user == null || !BcryptNet.Verify(request.Password, user.PasswordHash))
                return Unauthorized("Credenciales invalidas");

            var token = _jwtService.GenerarToken(user);
            var userDto = new UserDTO { Id = user.id, Username = user.Username, Role = user.Role };
            return Ok(new { token, user = userDto });
        }
        
    }
}