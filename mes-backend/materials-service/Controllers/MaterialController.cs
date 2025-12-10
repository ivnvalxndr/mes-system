using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using materials_service.Data;
using materials_service.DTO;
using materials_service.Entities;
namespace materials_service.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaterialController : ControllerBase
{
    private readonly MaterialDbContext _context;

    public MaterialController(MaterialDbContext context)
    {
        _context = context;
    }

    // GET: api/materials
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MaterialDTO>>> GetMaterials(
        [FromQuery] int? parentId = null,
        [FromQuery] bool includeChildren = false)
    {
        IQueryable<Material> query = _context.Materials
            .Include(m => m.Unit)
            .Include(m => m.Parent);

        if (parentId.HasValue)
        {
            query = query.Where(m => m.ParentId == parentId);
        }
        else if (!includeChildren)
        {
            // По умолчанию показываем только корневые элементы
            query = query.Where(m => m.ParentId == null);
        }

        if (includeChildren)
        {
            query = query.Include(m => m.Children);
        }

        var materials = await query.ToListAsync();
        return Ok(materials.Select(m => MapToDto(m, includeChildren)));
    }

    // GET: api/materials/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<MaterialDTO>> GetMaterial(int id)
    {
        var material = await _context.Materials
            .Include(m => m.Unit)
            .Include(m => m.Parent)
            .Include(m => m.Children)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (material == null)
        {
            return NotFound();
        }

        return MapToDto(material, true);
    }

    // POST: api/materials
    [HttpPost]
    public async Task<ActionResult<MaterialDTO>> CreateMaterial(CreateMaterialDTO createDto)
    {
        // Проверка уникальности кода
        if (await _context.Materials.AnyAsync(m => m.Code == createDto.Code))
        {
            return BadRequest("Material with this code already exists");
        }

        // Проверка существования родителя
        if (createDto.ParentId.HasValue)
        {
            var parentExists = await _context.Materials.AnyAsync(m => m.Id == createDto.ParentId);
            if (!parentExists)
            {
                return BadRequest("Parent material not found");
            }
        }

        // Проверка существования единицы измерения
        var unitExists = await _context.Units.AnyAsync(u => u.Id == createDto.UnitId);
        if (!unitExists)
        {
            return BadRequest("Unit not found");
        }

        var material = new Material
        {
            Code = createDto.Code,
            Name = createDto.Name,
            Description = createDto.Description,
            ParentId = createDto.ParentId,
            UnitId = createDto.UnitId,
            Pcs = createDto.Pcs,
            Mts = createDto.Mts,
            Tns = createDto.Tns
        };

        _context.Materials.Add(material);
        await _context.SaveChangesAsync();

        // Загружаем связанные данные для возврата
        await _context.Entry(material)
            .Reference(m => m.Unit)
            .LoadAsync();
        await _context.Entry(material)
            .Reference(m => m.Parent)
            .LoadAsync();

        return CreatedAtAction(nameof(GetMaterial), new { id = material.Id }, MapToDto(material, false));
    }

    // PUT: api/materials/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMaterial(int id, UpdateMaterialDTO updateDto)
    {
        var material = await _context.Materials.FindAsync(id);
        if (material == null)
        {
            return NotFound();
        }

        // Проверка уникальности кода (если изменился)
        if (!string.IsNullOrEmpty(updateDto.Code) && updateDto.Code != material.Code)
        {
            if (await _context.Materials.AnyAsync(m => m.Code == updateDto.Code && m.Id != id))
            {
                return BadRequest("Material with this code already exists");
            }
            material.Code = updateDto.Code;
        }

        // Обновляем другие поля
        if (!string.IsNullOrEmpty(updateDto.Name))
            material.Name = updateDto.Name;

        if (updateDto.Description != null)
            material.Description = updateDto.Description;

        if (updateDto.ParentId.HasValue)
        {
            // Проверка циклической зависимости
            if (updateDto.ParentId == id)
            {
                return BadRequest("Material cannot be its own parent");
            }

            var parentExists = await _context.Materials.AnyAsync(m => m.Id == updateDto.ParentId);
            if (!parentExists)
            {
                return BadRequest("Parent material not found");
            }
            material.ParentId = updateDto.ParentId;
        }
        else if (updateDto.ParentId == 0) // Если хотим сделать корневым
        {
            material.ParentId = null;
        }

        if (updateDto.UnitId.HasValue)
        {
            var unitExists = await _context.Units.AnyAsync(u => u.Id == updateDto.UnitId);
            if (!unitExists)
            {
                return BadRequest("Unit not found");
            }
            material.UnitId = updateDto.UnitId.Value;
        }

        if (updateDto.Pcs.HasValue)
            material.Pcs = updateDto.Pcs;

        if (updateDto.Mts.HasValue)
            material.Mts = updateDto.Mts;

        if (updateDto.Tns.HasValue)
            material.Tns = updateDto.Tns;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MaterialExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/materials/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMaterial(int id)
    {
        var material = await _context.Materials
            .Include(m => m.Children)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (material == null)
        {
            return NotFound();
        }

        // Проверяем, есть ли дочерние материалы
        if (material.Children.Any())
        {
            return BadRequest("Cannot delete material with children. Delete children first.");
        }

        // Проверяем, есть ли связанные шаги маршрута
        var hasRouteSteps = await _context.MaterialRouteSteps.AnyAsync(r => r.MaterialId == id);
        if (hasRouteSteps)
        {
            return BadRequest("Cannot delete material with route steps. Delete route steps first.");
        }

        _context.Materials.Remove(material);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/materials/search?code={code}
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<MaterialSimpleDTO>>> SearchMaterials(
        [FromQuery] string? code = null,
        [FromQuery] string? name = null)
    {
        IQueryable<Material> query = _context.Materials;

        if (!string.IsNullOrEmpty(code))
        {
            query = query.Where(m => m.Code.Contains(code));
        }

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(m => m.Name.Contains(name));
        }

        var materials = await query
            .Select(m => new MaterialSimpleDTO
            {
                Id = m.Id,
                Code = m.Code,
                Name = m.Name
            })
            .Take(20)
            .ToListAsync();

        return Ok(materials);
    }

    private bool MaterialExists(int id)
    {
        return _context.Materials.Any(e => e.Id == id);
    }

    private static MaterialDTO MapToDto(Material material, bool includeChildren)
    {
        var dto = new MaterialDTO
        {
            Id = material.Id,
            Code = material.Code,
            Name = material.Name,
            Description = material.Description,
            ParentId = material.ParentId,
            UnitId = material.UnitId,
            Pcs = material.Pcs,
            Mts = material.Mts,
            Tns = material.Tns,
            Parent = material.Parent != null ? new MaterialSimpleDTO
            {
                Id = material.Parent.Id,
                Code = material.Parent.Code,
                Name = material.Parent.Name
            } : null,
            Unit = material.Unit != null ? new UnitDTO
            {
                Id = material.Unit.Id,
                Code = material.Unit.Code,
                Name = material.Unit.Name,
                Description = material.Unit.Description,
                Type = material.Unit.Type.ToString(),
                Status = material.Unit.Status.ToString()
            } : null
        };

        if (includeChildren && material.Children != null)
        {
            dto.Children = material.Children.Select(c => new MaterialSimpleDTO
            {
                Id = c.Id,
                Code = c.Code,
                Name = c.Name
            }).ToList();
        }

        return dto;
    }
}