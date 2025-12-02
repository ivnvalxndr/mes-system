using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using units_service.Data;
using units_service.DTO;
using units_service.Entities.Enums;
using units_service.Entities;

namespace UnitService.Controllers
{
    [ApiController]
    [Route("api/units")]
    public class UnitController : ControllerBase
    {
        private readonly UnitDbContext _context;
        private readonly ILogger<UnitController> _logger;

        public UnitController(UnitDbContext context, ILogger<UnitController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET /api/units
        [HttpGet]
        public async Task<IActionResult> GetUnits()
        {
            var units = await _context.Units.ToListAsync();

            var response = units.Select(u => new UnitDTO
            {
                Id = u.Id,
                UnitNumber = u.UnitNumber,
                Name = u.Name,
                Description = u.Description,
                Type = u.Type,
                Status = u.Status,
                Model = u.Model,
                Manufacturer = u.Manufacturer,
                SerialNumber = u.SerialNumber,
                InstallationDate = u.InstallationDate,
                LastMaintenanceDate = u.LastMaintenanceDate,
                NextMaintenanceDate = u.NextMaintenanceDate,
                CurrentLoad = u.CurrentLoad,
                MaxCapacity = u.MaxCapacity,
                Location = u.Location,
                CurrentProductionOrderId = u.CurrentProductionOrderId,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,
                CreatedBy = u.CreatedBy
            });

            return Ok(response);
        }

        // POST /api/units
        [HttpPost]
        public async Task<IActionResult> CreateUnit([FromBody] UnitDTO request)
        {
            var unit = new Unit
            {
                UnitNumber = GenerateUnitNumber(),
                Name = request.Name,
                Description = request.Description,
                Type = request.Type,
                Status = UnitStatus.Available,
                Model = request.Model,
                Manufacturer = request.Manufacturer,
                SerialNumber = request.SerialNumber,
                InstallationDate = request.InstallationDate,
                LastMaintenanceDate = request.LastMaintenanceDate,
                NextMaintenanceDate = request.NextMaintenanceDate,
                CurrentLoad = request.CurrentLoad,
                MaxCapacity = request.MaxCapacity,
                Location = request.Location,
                CurrentProductionOrderId = request.CurrentProductionOrderId,
                CreatedBy = User.Identity?.Name ?? "System"
            };

            _context.Units.Add(unit);
            await _context.SaveChangesAsync();

            // Логируем начальный статус
            var statusHistory = new UnitStatusHistory
            {
                UnitId = unit.Id,
                PreviousStatus = UnitStatus.Available,
                NewStatus = UnitStatus.Available,
                Reason = "Initial creation",
                ChangedBy = unit.CreatedBy
            };

            _context.UnitStatusHistories.Add(statusHistory);
            await _context.SaveChangesAsync();

            return Ok(new UnitDTO
            {
                Id = unit.Id,
                UnitNumber = unit.UnitNumber,
                Name = unit.Name,
                Description = unit.Description,
                Type = unit.Type,
                Status = unit.Status,
                Model = unit.Model,
                Manufacturer = unit.Manufacturer,
                SerialNumber = unit.SerialNumber,
                InstallationDate = unit.InstallationDate,
                LastMaintenanceDate = unit.LastMaintenanceDate,
                NextMaintenanceDate = unit.NextMaintenanceDate,
                CurrentLoad = unit.CurrentLoad,
                MaxCapacity = unit.MaxCapacity,
                Location = unit.Location,
                CurrentProductionOrderId = unit.CurrentProductionOrderId,
                CreatedAt = unit.CreatedAt,
                UpdatedAt = unit.UpdatedAt,
                CreatedBy = unit.CreatedBy
            });
        }

        // GET /api/units/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUnit(int id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null) return NotFound();

            return Ok(new UnitDTO
            {
                Id = unit.Id,
                UnitNumber = unit.UnitNumber,
                Name = unit.Name,
                Description = unit.Description,
                Type = unit.Type,
                Status = unit.Status,
                Model = unit.Model,
                Manufacturer = unit.Manufacturer,
                SerialNumber = unit.SerialNumber,
                InstallationDate = unit.InstallationDate,
                LastMaintenanceDate = unit.LastMaintenanceDate,
                NextMaintenanceDate = unit.NextMaintenanceDate,
                CurrentLoad = unit.CurrentLoad,
                MaxCapacity = unit.MaxCapacity,
                Location = unit.Location,
                CurrentProductionOrderId = unit.CurrentProductionOrderId,
                CreatedAt = unit.CreatedAt,
                UpdatedAt = unit.UpdatedAt,
                CreatedBy = unit.CreatedBy
            });
        }

        // GET /api/units/{id}/status
        [HttpGet("{id}/status")]
        public async Task<IActionResult> GetUnitStatus(int id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null) return NotFound();

            return Ok(new
            {
                unit.Id,
                unit.UnitNumber,
                unit.Name,
                unit.Status,
                unit.CurrentLoad,
                unit.CurrentProductionOrderId,
                LastUpdated = unit.UpdatedAt
            });
        }

        // PUT /api/units/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateUnitStatus(int id, [FromBody] UpdateStatusDTO request)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null) return NotFound();

            // Сохраняем историю смены статуса
            var statusHistory = new UnitStatusHistory
            {
                UnitId = unit.Id,
                PreviousStatus = unit.Status,
                NewStatus = request.Status,
                Reason = request.Reason,
                Notes = request.Notes,
                ProductionOrderId = request.ProductionOrderId,
                ChangedBy = User.Identity?.Name ?? "System"
            };

            _context.UnitStatusHistories.Add(statusHistory);

            // Обновляем статус оборудования
            unit.Status = request.Status;
            unit.UpdatedAt = DateTime.UtcNow;

            // Если статус "В работе", обновляем ProductionOrderId
            if (request.Status == UnitStatus.InUse)
            {
                unit.CurrentProductionOrderId = request.ProductionOrderId;
            }
            else if (request.Status == UnitStatus.Available)
            {
                unit.CurrentProductionOrderId = null;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Status updated successfully" });
        }

        // GET /api/units/{id}/history
        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetStatusHistory(int id)
        {
            var history = await _context.UnitStatusHistories
                .Where(h => h.UnitId == id)
                .OrderByDescending(h => h.ChangedAt)
                .ToListAsync();

            return Ok(history.Select(h => new
            {
                h.Id,
                h.PreviousStatus,
                h.NewStatus,
                h.Reason,
                h.Notes,
                h.ProductionOrderId,
                ChangedAt = h.ChangedAt,
                ChangedBy = h.ChangedBy
            }));
        }

        private string GenerateUnitNumber()
        {
            return $"UNIT-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}";
        }
    }
}