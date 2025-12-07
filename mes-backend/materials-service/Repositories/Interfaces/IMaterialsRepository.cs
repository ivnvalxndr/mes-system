using materials_service.Entities;

namespace materials_service.Repositories.Interfaces;

public interface IMaterialsRepository
{
    Task<IEnumerable<Material>> GetAllAsync();
    Task<Material?> GetByIdAsync(int id);
    Task<Material> CreateAsync(Material material);
    Task<Material> UpdateAsync(Material material);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}