using materials_service.Data;
using materials_service.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using units_service.Entities;

namespace materials_service.Repositories;

public class UnitRepository : IUnitRepository
{
    private readonly MaterialDbContext _context;

    public UnitRepository(MaterialDbContext context)
    {
        _context = context;
    }

    public async Task<Unit?> GetByIdAsync(int id)
    {
        return await _context.Units.FindAsync(id);
    }

    public async Task<IEnumerable<Unit>> GetAllAsync()
    {
        return await _context.Units.ToListAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Units.AnyAsync(u => u.Id == id);
    }

    public async Task<Unit> CreateAsync(Unit unit)
    {
        _context.Units.Add(unit);
        await _context.SaveChangesAsync();
        return unit;
    }

    public async Task<Unit> UpdateAsync(Unit unit)
    {
        _context.Entry(unit).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return unit;
    }

    public async Task DeleteAsync(int id)
    {
        var unit = await _context.Units.FindAsync(id);
        if (unit != null)
        {
            _context.Units.Remove(unit);
            await _context.SaveChangesAsync();
        }
    }
}