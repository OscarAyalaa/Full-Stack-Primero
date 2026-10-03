using System.Security.Claims;
using ControlAPI.Data;
using ControlAPI.Dtos;
using ControlAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControlAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TareaController: ControllerBase
    {
        private readonly AppDbContext _context;

        public TareaController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private Task<Tarea?> encontrarTarea(int id)
        {
            var userId = GetUserId();
            if(User.IsInRole("Admin"))
                return _context.Tareas.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id);
            return _context.Tareas.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        [HttpGet]
        public async Task<IActionResult> obtenerTareas()
        {
            var userId = GetUserId();

            if (User.IsInRole("Admin"))
            {
                var todasTareas = await _context.Tareas
                    .Include(t => t.User)
                    .Select(t => new TareaDTO
                    {
                        Id = t.Id,
                        Titulo = t.Titulo,
                        Descripcion = t.Descripcion,
                        Completado = t.Completado,
                        UserId = t.UserId,
                        Username = t.User!.Username
                    })
                    .ToListAsync();
                
                return Ok(todasTareas);
            }

            var tareas = await _context.Tareas
                .Where(t => t.UserId == userId)
                .Select(t => new TareaDTO
                {
                    Id = t.Id,
                    Titulo = t.Titulo,
                    Descripcion = t.Descripcion,
                    Completado = t.Completado,
                    UserId = t.UserId,
                    Username = User.Identity!.Name!
                })
                .ToListAsync();
            
            return Ok(tareas);
        }

        [HttpPost]
        public async Task<IActionResult> crearTarea(Tarea tarea)
        {
            var tareaG = new Tarea
            {
                Titulo = tarea.Titulo,
                Descripcion = tarea.Descripcion,
                Completado = false,
                UserId = GetUserId()
            };

            _context.Tareas.Add(tareaG);
            await _context.SaveChangesAsync();

            var responseDto = new TareaDTO
            {
                Id = tareaG.Id,
                Titulo = tareaG.Titulo,
                Descripcion = tareaG.Descripcion,
                Completado = tareaG.Completado,
                UserId = tareaG.UserId,
                Username = User.Identity!.Name!
            };

            return CreatedAtAction(nameof(obtenerTareaId), new { id = tarea.Id}, responseDto);
        }

        // GET: api/tasks/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> obtenerTareaId(int id)
        {
            
            var tarea = await encontrarTarea(id);
            if (tarea == null) return NotFound();

            var tareaDTO = new TareaDTO
            {
                Id = tarea.Id,
                Titulo = tarea.Titulo,
                Descripcion = tarea.Descripcion,
                Completado = tarea.Completado,
                UserId = tarea.UserId,
                Username = tarea.User?.Username ?? User.Identity!.Name!
            };

            return Ok(tareaDTO);
        }


        // PUT: api/tasks/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> actualizarTarea(int id, Tarea updTarea)
        {
            var tarea = await encontrarTarea(id);
            if (tarea == null) return NotFound();

            tarea.Titulo = updTarea.Titulo;
            tarea.Descripcion = updTarea.Descripcion;
            tarea.Completado = updTarea.Completado;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id:int}")]

        public async Task<IActionResult> DeleteTarea(int id)
        {
            var tarea = await encontrarTarea(id);
            if (tarea == null) return NotFound();

            _context.Tareas.Remove(tarea);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}