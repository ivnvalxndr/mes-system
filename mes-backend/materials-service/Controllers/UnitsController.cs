using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using materials_service.Data;
using materials_service.DTO;
using units_service.Entities;
using units_service.Entities.Enums;


namespace materials_service.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnitsController : ControllerBase
{
    private readonly MaterialDbContext _context;

    public UnitsController(MaterialDbContext context)
    {
        _context = context;
    }

    // GET: api/units
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UnitDTO>>> GetUnits()
    {
        var units = await _context.Units.ToListAsync();
        return Ok(units.Select(u => MapToDto(u)));
    }

    // GET: api/units/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<UnitDTO>> GetUnit(int id)
    {
        var unit = await _context.Units.FindAsync(id);

        if (unit == null)
        {
            return NotFound();
        }

        return MapToDto(unit);
    }

    // POST: api/units
    [HttpPost]
    public async Task<ActionResult<UnitDTO>> CreateUnit(CreateUnitDTO createDto)
    {
        // Проверка уникальности кода
        if (await _context.Units.AnyAsync(u => u.Code == createDto.Code))
        {
            return BadRequest("Unit with this code already exists");
        }

        // Проверка типа
        if (!Enum.TryParse<UnitType>(createDto.Type, out var unitType))
        {
            return BadRequest("Invalid unit type");
        }

        var unit = new Unit
        {
            Code = createDto.Code,
            Name = createDto.Name,
            Description = createDto.Description,
            Type = unitType,
            Status = UnitStatus.Available
        };

        _context.Units.Add(unit);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUnit), new { id = unit.Id }, MapToDto(unit));
    }

    // PUT: api/units/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUnit(int id, UpdateUnitDTO updateDto)
    {
        var unit = await _context.Units.FindAsync(id);
        if (unit == null)
        {
            return NotFound();
        }

        // Обновляем только переданные поля
        if (!string.IsNullOrEmpty(updateDto.Name))
            unit.Name = updateDto.Name;

        if (!string.IsNullOrEmpty(updateDto.Description))
            unit.Description = updateDto.Description;

        if (!string.IsNullOrEmpty(updateDto.Type) &&
            Enum.TryParse<UnitType>(updateDto.Type, out var newType))
            unit.Type = newType;

        if (!string.IsNullOrEmpty(updateDto.Status) &&
            Enum.TryParse<UnitStatus>(updateDto.Status, out var newStatus))
            unit.Status = newStatus;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UnitExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/units/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUnit(int id)
    {
        var unit = await _context.Units.FindAsync(id);
        if (unit == null)
        {
            return NotFound();
        }

        // Проверяем, используется ли единица в материалах
        var isUsedInMaterials = await _context.Materials.AnyAsync(m => m.UnitId == id);
        var isUsedInRouteSteps = await _context.MaterialRouteSteps.AnyAsync(r => r.UnitId == id);

        if (isUsedInMaterials || isUsedInRouteSteps)
        {
            // Вместо удаления, можно изменить статус на Archived
            unit.Status = UnitStatus.Archived;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Unit archived because it's in use" });
        }

        _context.Units.Remove(unit);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/units/available
    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<UnitDTO>>> GetAvailableUnits()
    {
        var units = await _context.Units
            .Where(u => u.Status == UnitStatus.Available)
            .ToListAsync();

        return Ok(units.Select(u => MapToDto(u)));
    }

    private bool UnitExists(int id)
    {
        return _context.Units.Any(e => e.Id == id);
    }

    private static UnitDTO MapToDto(Unit unit)
    {
        return new UnitDTO
        {
            Id = unit.Id,
            Code = unit.Code,
            Name = unit.Name,
            Description = unit.Description,
            Type = unit.Type.ToString(),
            Status = unit.Status.ToString()
        };
    }
}