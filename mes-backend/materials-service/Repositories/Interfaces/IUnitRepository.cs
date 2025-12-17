using units_service.Entities;

namespace materials_service.Repositories.Interfaces;

public interface IUnitRepository
{
    Task<Unit?> GetByIdAsync(int id);
    Task<IEnumerable<Unit>> GetAllAsync();
    Task<bool> ExistsAsync(int id);
    Task<Unit> CreateAsync(Unit unit);
    Task<Unit> UpdateAsync(Unit unit);
    Task DeleteAsync(int id);
}