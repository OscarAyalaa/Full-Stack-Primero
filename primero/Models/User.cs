namespace ControlAPI.Models
{
    public class User
    {
        public int id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        //public string? Password { get; set; }                recorrdar ponerlo pra futuros code
        public string Role { get; set; } = "User";

        public ICollection<Tarea>? Tareas { get; set; }
    }
}