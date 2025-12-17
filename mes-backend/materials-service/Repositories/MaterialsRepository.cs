using Microsoft.EntityFrameworkCore;
using materials_service.Data;
using materials_service.Entities;
using materials_service.Repositories.Interfaces;

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
        IQueryable<Material> query = _context.Materials
            .Include(m => m.Unit)
            .Include(m => m.Parent);

        return await query.ToListAsync();
    }

    public async Task<Material?> GetByIdAsync(int id, bool includeChildren = false)
    {
        var query = _context.Materials
            .Include(m => m.Unit)
            .Include(m => m.Parent)
            .AsQueryable();

        if (includeChildren)
        {
            query = query.Include(m => m.Children);
        }

        return await query.FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<IEnumerable<Material>> SearchAsync(string? code, string? name)
    {
        IQueryable<Material> query = _context.Materials;

        if (!string.IsNullOrEmpty(code))
            query = query.Where(m => m.Code.Contains(code));

        if (!string.IsNullOrEmpty(name))
            query = query.Where(m => m.Name.Contains(name));

        return await query
            .Select(m => new Material { Id = m.Id, Code = m.Code, Name = m.Name })
            .Take(20)
            .ToListAsync();
    }

    public async Task<bool> CodeExistsAsync(string code, int? excludeId = null)
    {
        var query = _context.Materials.Where(m => m.Code == code);

        if (excludeId.HasValue)
            query = query.Where(m => m.Id != excludeId.Value);

        return await query.AnyAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Materials.AnyAsync(m => m.Id == id);
    }

    public async Task<bool> HasDependenciesAsync(int id)
    {
        // Пример проверки зависимостей
        return await _context.MaterialRouteSteps.AnyAsync(r => r.MaterialId == id);
        // Добавьте другие проверки по необходимости
    }

    public async Task<Material> CreateAsync(Material material)
    {
        _context.Materials.Add(material);
        await _context.SaveChangesAsync();
        return material;
    }

    public async Task<Material> UpdateAsync(Material material)
    {
        _context.Entry(material).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return material;
    }

    public async Task DeleteAsync(int id)
    {
        var material = await _context.Materials.FindAsync(id);
        if (material != null)
        {
            _context.Materials.Remove(material);
            await _context.SaveChangesAsync();
        }
    }
}