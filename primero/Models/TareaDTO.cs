namespace ControlAPI.Dtos
{
    public class TareaDTO
    {
        public int Id { get; set; }
        public string? Titulo { get; set; }
        public string? Descripcion { get; set; }
        public bool Completado { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
    }
}