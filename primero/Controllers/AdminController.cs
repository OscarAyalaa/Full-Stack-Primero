using System.Security.Claims;
using ControlAPI.Data;
using ControlAPI.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControlAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]

    public class AdminController: ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> TodosLosUsuarios()
        {
            var usuarios = await _context.Users
                .Select(u => new UserDTO {Id = u.id, Username = u.Username, Role = u.Role})
                .ToListAsync();

            return Ok(usuarios);
        }

        [HttpPut("promover/{userId}")]
        public async Task<IActionResult> PromoverAdmin(int userId)
        {
            var usuario = await _context.Users.FindAsync(userId);

            if (usuario == null) return NotFound();

            usuario.Role = "Admin";
            await _context.SaveChangesAsync();

            return Ok( new { mensaje = $" Usuario {usuario.Username} promovido a Admin."});
        }

        [HttpPut("degradar/{userId}")]
        public async Task<IActionResult> DegradarRango(int userId)
        {
            var usuario = await _context.Users.FindAsync(userId);

            if (usuario == null) return NotFound();

            usuario.Role = "User";
            await _context.SaveChangesAsync();

            return Ok( new { mensaje = $" Usuario {usuario.Username} Degradado a User."});
        }

        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> eliminarUsuario(int userId)
        {

            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (currentUserId == userId)
                return BadRequest(new { message = "No puedes eliminarte a ti mismo." });


            var usuario = await _context.Users.FindAsync(userId);
            if (usuario == null) return NotFound();

            _context.Users.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok( new { mensaje = $" Usuario {usuario.Username} Eliminado"});
        }
    }
}