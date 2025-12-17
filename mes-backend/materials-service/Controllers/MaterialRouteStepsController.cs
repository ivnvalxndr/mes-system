using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using materials_service.Data;
using materials_service.Entities;
using materials_service.Entities.Enums;
using materials_service.DTO;

namespace materials_service.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaterialRouteStepsController : ControllerBase
{
    private readonly MaterialDbContext _context;

    public MaterialRouteStepsController(MaterialDbContext context)
    {
        _context = context;
    }

    // GET: api/materialroutesteps
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MaterialRouteStepDTO>>> GetMaterialRouteSteps(
        [FromQuery] int? materialId = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        IQueryable<MaterialRouteStep> query = _context.MaterialRouteSteps
            .Include(r => r.Material)
            .Include(r => r.Unit);

        if (materialId.HasValue)
        {
            query = query.Where(r => r.MaterialId == materialId);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(r => r.OperationDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(r => r.OperationDate <= toDate.Value);
        }

        query = query.OrderByDescending(r => r.OperationDate);

        var steps = await query.ToListAsync();
        return Ok(steps.Select(r => MapToDto(r)));
    }

    // GET: api/materialroutesteps/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<MaterialRouteStepDTO>> GetMaterialRouteStep(int id)
    {
        var step = await _context.MaterialRouteSteps
            .Include(r => r.Material)
            .Include(r => r.Unit)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (step == null)
        {
            return NotFound();
        }

        return MapToDto(step);
    }

    // POST: api/materialroutesteps
    [HttpPost]
    public async Task<ActionResult<MaterialRouteStepDTO>> CreateMaterialRouteStep(
    CreateMaterialRouteStepDTO createDto)
    {
        try
        {
            // Проверка существования материала
            var materialExists = await _context.Materials.AnyAsync(m => m.Id == createDto.MaterialId);
            if (!materialExists)
            {
                return BadRequest("Material not found");
            }

            // Проверка существования единицы измерения (если указана)
            if (createDto.UnitId.HasValue)
            {
                var unitExists = await _context.Units.AnyAsync(u => u.Id == createDto.UnitId.Value);
                if (!unitExists)
                {
                    return BadRequest("Unit not found");
                }
            }

            // Проверка типа шага
            if (!Enum.TryParse<MaterialRouteStepType>(createDto.StepType, out var stepType))
            {
                return BadRequest($"Invalid step type. Valid values: {string.Join(", ", Enum.GetNames(typeof(MaterialRouteStepType)))}");
            }

            // Проверка, что указано хотя бы одно количество
            if (!createDto.Pcs.HasValue && !createDto.Mts.HasValue && !createDto.Tns.HasValue)
            {
                return BadRequest("At least one quantity field must be specified (Pcs, Mts, or Tns)");
            }

            // Проверка отрицательных значений
            if (createDto.Pcs.HasValue && createDto.Pcs < 0)
                return BadRequest("Pcs cannot be negative");

            if (createDto.Mts.HasValue && createDto.Mts < 0)
                return BadRequest("Mts cannot be negative");

            if (createDto.Tns.HasValue && createDto.Tns < 0)
                return BadRequest("Tns cannot be negative");

            var step = new MaterialRouteStep
            {
                MaterialId = createDto.MaterialId,
                StepType = stepType,
                FromLocation = createDto.FromLocation?.Trim() ?? string.Empty,
                ToLocation = createDto.ToLocation?.Trim() ?? string.Empty,
                UnitId = createDto.UnitId,
                OperationDate = createDto.OperationDate,
                Pcs = createDto.Pcs,
                Mts = createDto.Mts,
                Tns = createDto.Tns,
                Notes = createDto.Notes?.Trim() ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            _context.MaterialRouteSteps.Add(step);
            await _context.SaveChangesAsync();

            // Загружаем связанные данные
            await _context.Entry(step)
                .Reference(r => r.Material)
                .LoadAsync();

            if (step.UnitId.HasValue)
            {
                await _context.Entry(step)
                    .Reference(r => r.Unit)
                    .LoadAsync();
            }

            return CreatedAtAction(nameof(GetMaterialRouteStep), new { id = step.Id }, MapToDto(step));
        }
        catch (Exception ex)
        {
            // Логирование ошибки
            //_logger.LogError(ex, "Error creating material route step");
            return StatusCode(500, "An error occurred while creating the material route step");
        }
    }

    // PUT: api/materialroutesteps/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMaterialRouteStep(int id, UpdateMaterialRouteStepDTO updateDto)
    {
        var step = await _context.MaterialRouteSteps.FindAsync(id);
        if (step == null)
        {
            return NotFound();
        }

        // Обновляем поля
        if (!string.IsNullOrEmpty(updateDto.StepType) &&
            Enum.TryParse<MaterialRouteStepType>(updateDto.StepType, out var newStepType))
            step.StepType = newStepType;

        if (!string.IsNullOrEmpty(updateDto.FromLocation))
            step.FromLocation = updateDto.FromLocation;

        if (!string.IsNullOrEmpty(updateDto.ToLocation))
            step.ToLocation = updateDto.ToLocation;

        if (updateDto.UnitId.HasValue)
        {
            var unitExists = await _context.Units.AnyAsync(u => u.Id == updateDto.UnitId);
            if (!unitExists)
            {
                return BadRequest("Unit not found");
            }
            step.UnitId = updateDto.UnitId;
        }

        if (updateDto.OperationDate.HasValue)
            step.OperationDate = updateDto.OperationDate.Value;

        if (updateDto.Pcs.HasValue)
            step.Pcs = updateDto.Pcs;

        if (updateDto.Mts.HasValue)
            step.Mts = updateDto.Mts;

        if (updateDto.Tns.HasValue)
            step.Tns = updateDto.Tns;

        if (!string.IsNullOrEmpty(updateDto.Notes))
            step.Notes = updateDto.Notes;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MaterialRouteStepExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/materialroutesteps/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMaterialRouteStep(int id)
    {
        var step = await _context.MaterialRouteSteps.FindAsync(id);
        if (step == null)
        {
            return NotFound();
        }

        _context.MaterialRouteSteps.Remove(step);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/materialroutesteps/material/{materialId}
    [HttpGet("material/{materialId}")]
    public async Task<ActionResult<IEnumerable<MaterialRouteStepDTO>>> GetStepsByMaterial(int materialId)
    {
        var materialExists = await _context.Materials.AnyAsync(m => m.Id == materialId);
        if (!materialExists)
        {
            return NotFound("Material not found");
        }

        var steps = await _context.MaterialRouteSteps
            .Where(r => r.MaterialId == materialId)
            .Include(r => r.Unit)
            .OrderByDescending(r => r.OperationDate)
            .ToListAsync();

        return Ok(steps.Select(r => MapToDto(r)));
    }

    // GET: api/materialroutesteps/summary/{materialId}
    [HttpGet("summary/{materialId}")]
    public async Task<ActionResult<object>> GetMaterialSummary(int materialId)
    {
        var materialExists = await _context.Materials.AnyAsync(m => m.Id == materialId);
        if (!materialExists)
        {
            return NotFound("Material not found");
        }

        var steps = await _context.MaterialRouteSteps
            .Where(r => r.MaterialId == materialId)
            .ToListAsync();

        var summary = new
        {
            TotalPcs = steps.Where(r => r.Pcs.HasValue).Sum(r => r.Pcs) ?? 0,
            TotalMts = steps.Where(r => r.Mts.HasValue).Sum(r => r.Mts) ?? 0,
            TotalTns = steps.Where(r => r.Tns.HasValue).Sum(r => r.Tns) ?? 0,
            StepCount = steps.Count,
            LastOperation = steps.OrderByDescending(r => r.OperationDate).FirstOrDefault()?.OperationDate
        };

        return Ok(summary);
    }

    private bool MaterialRouteStepExists(int id)
    {
        return _context.MaterialRouteSteps.Any(e => e.Id == id);
    }

    private static MaterialRouteStepDTO MapToDto(MaterialRouteStep step)
    {
        return new MaterialRouteStepDTO
        {
            Id = step.Id,
            MaterialId = step.MaterialId,
            StepType = step.StepType.ToString(),
            FromLocation = step.FromLocation,
            ToLocation = step.ToLocation,
            UnitId = step.UnitId,
            OperationDate = step.OperationDate,
            Pcs = step.Pcs,
            Mts = step.Mts,
            Tns = step.Tns,
            Notes = step.Notes,
            CreatedAt = step.CreatedAt,
            Material = step.Material != null ? new MaterialSimpleDTO
            {
                Id = step.Material.Id,
                Code = step.Material.Code,
                Name = step.Material.Name
            } : null,
            Unit = step.Unit != null ? new UnitDTO
            {
                Id = step.Unit.Id,
                Code = step.Unit.Code.ToString(),
                Name = step.Unit.Name,
                Description = step.Unit.Description,
                Type = step.Unit.Type.ToString(),
                Status = step.Unit.Status.ToString()
            } : null
        };
    }
}