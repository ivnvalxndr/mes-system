using materials_service.Data;
using materials_service.Entities;
using materials_service.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace materials_service.Repositories;

public class MaterialsRepository : IMaterialsRepository
{
    private readonly MaterialDbContext _context;

    public MaterialsRepository(MaterialDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Material>> GetAllAsync()
    {
        return await _context.Materials
            .Include(m => m.Unit)
            .Include(m => m.RouteSteps)
            .ToListAsync();
    }

    public async Task<Material?> GetByIdAsync(int id)
    {
        return await _context.Materials
            .Include(m => m.Unit)
            .Include(m => m.RouteSteps)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<Material> CreateAsync(Material material)
    {
        _context.Materials.Add(material);
        await _context.SaveChangesAsync();
        return material;
    }

    public async Task<Material> UpdateAsync(Material material)
    {
        _context.Materials.Update(material);
        await _context.SaveChangesAsync();
        return material;
    }

    public async Task DeleteAsync(int id)
    {
        var material = await GetByIdAsync(id);
        if (material != null)
        {
            _context.Materials.Remove(material);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Materials.AnyAsync(m => m.Id == id);
    }
}