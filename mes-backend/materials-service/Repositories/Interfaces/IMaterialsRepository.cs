using materials_service.Entities;

namespace materials_service.Repositories.Interfaces;

public interface IMaterialsRepository
{
    Task<IEnumerable<Material>> GetAllAsync();
    Task<Material?> GetByIdAsync(int id, bool includeChildren = false);
    Task<IEnumerable<Material>> SearchAsync(string? code, string? name);
    Task<bool> CodeExistsAsync(string code, int? excludeId = null);
    Task<bool> ExistsAsync(int id);
    Task<bool> HasDependenciesAsync(int id);
    Task<Material> CreateAsync(Material material);
    Task<Material> UpdateAsync(Material material);
    Task DeleteAsync(int id);
}