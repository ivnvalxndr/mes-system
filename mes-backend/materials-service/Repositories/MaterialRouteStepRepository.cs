using materials_service.Data;
using materials_service.Entities;
using materials_service.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace materials_service.Repositories;

public class MaterialRouteStepRepository : IMaterialRouteStepRepository
{
    private readonly MaterialDbContext _context;

    public MaterialRouteStepRepository(MaterialDbContext context)
    {
        _context = context;
    }

    public async Task<MaterialRouteStep> CreateAsync(MaterialRouteStep step)
    {
        _context.MaterialRouteSteps.Add(step);
        await _context.SaveChangesAsync();
        return step;
    }

    public async Task<IEnumerable<MaterialRouteStep>> GetByMaterialIdAsync(int materialId)
    {
        return await _context.MaterialRouteSteps
            .Where(s => s.MaterialId == materialId)
            .OrderBy(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<MaterialRouteStep?> GetByIdAsync(int stepId)
    {
        return await _context.MaterialRouteSteps
            .FirstOrDefaultAsync(s => s.Id == stepId);
    }

    public async Task<MaterialRouteStep> UpdateAsync(MaterialRouteStep step)
    {
        _context.MaterialRouteSteps.Update(step);
        await _context.SaveChangesAsync();
        return step;
    }

    public async Task DeleteAsync(int stepId)
    {
        var step = await GetByIdAsync(stepId);
        if (step != null)
        {
            _context.MaterialRouteSteps.Remove(step);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int stepId)
    {
        return await _context.MaterialRouteSteps
            .AnyAsync(s => s.Id == stepId);
    }
}