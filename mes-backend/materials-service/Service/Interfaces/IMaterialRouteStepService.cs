using materials_service.DTO;

namespace materials_service.Service.Interfaces;

public interface IMaterialRouteStepService
{
    Task<MaterialRouteStepDTO> CreateStepAsync(CreateMaterialRouteStepDTO createDTO);
    Task<IEnumerable<MaterialRouteStepDTO>> GetStepsByMaterialIdAsync(int materialId);
    Task<MaterialRouteStepDTO?> GetStepByIdAsync(int stepId);
    Task<MaterialRouteStepDTO> UpdateStepAsync(int stepId, MaterialRouteStepDTO stepDTO);
    Task DeleteStepAsync(int stepId);
    Task<bool> StepExistsAsync(int stepId);
}