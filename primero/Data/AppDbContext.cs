using Microsoft.EntityFrameworkCore;
using ControlAPI.Models;

namespace ControlAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Tarea> Tareas { get; set; }
        
    }
}