using materials_service.Entities;

namespace materials_service.Repositories.Interfaces;

public interface IMaterialRouteStepRepository
{
    Task<MaterialRouteStep> CreateAsync(MaterialRouteStep step);
    Task<IEnumerable<MaterialRouteStep>> GetByMaterialIdAsync(int materialId);
    Task<MaterialRouteStep?> GetByIdAsync(int stepId);
    Task<MaterialRouteStep> UpdateAsync(MaterialRouteStep step);
    Task DeleteAsync(int stepId);
    Task<bool> ExistsAsync(int stepId);
}