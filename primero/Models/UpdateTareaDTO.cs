namespace ControlAPI.Dtos
{
    public class UpdateTareaDTO
    {
        public string? Titulo { get; set; }
        public string? Descripcion { get; set; }
        public bool Completado { get; set; }
    }
}