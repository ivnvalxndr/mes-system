using materials_service.DTO;

namespace materials_service.Service.Interfaces;

public interface IMaterialsService
{
    Task<IEnumerable<MaterialDTO>> GetAllMaterialsAsync();
    Task<MaterialDTO?> GetMaterialByIdAsync(int id);
    Task<IEnumerable<MaterialSimpleDTO>> SearchMaterialsAsync(string? code, string? name);
    Task<MaterialDTO> CreateMaterialAsync(CreateMaterialDTO createDTO);
    Task<MaterialDTO> UpdateMaterialAsync(int id, UpdateMaterialDTO updateDTO);
    Task DeleteMaterialAsync(int id);
}