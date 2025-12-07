using materials_service.DTO;

namespace materials_service.Service.Interfaces;

public interface IMaterialsService
{
    Task<IEnumerable<MaterialDTO>> GetAllMaterialsAsync();
    Task<MaterialDTO?> GetMaterialByIdAsync(int id);
    Task<MaterialDTO> CreateMaterialAsync(CreateMaterialDTO createDto);
    Task<MaterialDTO> UpdateMaterialAsync(int id, UpdateMaterialDTO updateDto);
    Task DeleteMaterialAsync(int id);
}