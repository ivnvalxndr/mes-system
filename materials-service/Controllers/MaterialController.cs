using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaterialService.Data;
using MaterialService.Entities;
using MaterialService.Entities.Enums;
using MaterialService.DTO;
using materials_service.Data;
using materials_service.DTO;
using materials_service.Entities;

namespace MaterialService.Controllers
{
    [ApiController]
    [Route("api/materials")]
    public class MaterialController : ControllerBase
    {
        private readonly MaterialDbContext _context;
        private readonly ILogger<MaterialController> _logger;

        public MaterialController(MaterialDbContext context, ILogger<MaterialController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET /api/materials
        [HttpGet]
        public async Task<IActionResult> GetMaterials()
        {
            var materials = await _context.Materials.ToListAsync();

            var response = materials.Select(m => new MaterialDTO
            {
                Id = m.Id,
                MaterialNumber = m.MaterialNumber,
                Name = m.Name,
                Description = m.Description,
                Type = m.Type,
                Unit = m.Unit,
                Quantity = m.Quantity,
                MinQuantity = m.MinQuantity,
                MaxQuantity = m.MaxQuantity,
                Status = m.Status,
                StorageLocation = m.StorageLocation,
                BatchNumber = m.BatchNumber,
                ExpiryDate = m.ExpiryDate,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt,
                CreatedBy = m.CreatedBy
            });

            return Ok(response);
        }

        // POST /api/materials
        [HttpPost]
        public async Task<IActionResult> CreateMaterial([FromBody] MaterialDTO request)
        {
            var material = new Material
            {
                MaterialNumber = GenerateMaterialNumber(),
                Name = request.Name,
                Description = request.Description,
                Type = request.Type,
                Unit = request.Unit,
                Quantity = request.Quantity,
                MinQuantity = request.MinQuantity,
                MaxQuantity = request.MaxQuantity,
                Status = MaterialStatus.ВПоступлении,
                StorageLocation = request.StorageLocation,
                BatchNumber = request.BatchNumber,
                ExpiryDate = request.ExpiryDate,
                CreatedBy = User.Identity?.Name ?? "System"
            };

            _context.Materials.Add(material);
            await _context.SaveChangesAsync();

            // Создаем первый шаг маршрута - поступление
            var routeStep = new MaterialRouteStep
            {
                MaterialId = material.Id,
                StepType = RouteStepType.Поступление,
                FromLocation = "Поставщик",
                ToLocation = material.StorageLocation,
                Quantity = material.Quantity,
                CreatedBy = material.CreatedBy
            };

            _context.MaterialRouteSteps.Add(routeStep);
            await _context.SaveChangesAsync();

            return Ok(new MaterialDTO
            {
                Id = material.Id,
                MaterialNumber = material.MaterialNumber,
                Name = material.Name,
                Description = material.Description,
                Type = material.Type,
                Unit = material.Unit,
                Quantity = material.Quantity,
                MinQuantity = material.MinQuantity,
                MaxQuantity = material.MaxQuantity,
                Status = material.Status,
                StorageLocation = material.StorageLocation,
                BatchNumber = material.BatchNumber,
                ExpiryDate = material.ExpiryDate,
                CreatedAt = material.CreatedAt,
                UpdatedAt = material.UpdatedAt,
                CreatedBy = material.CreatedBy
            });
        }

        // PUT /api/materials/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaterial(int id, [FromBody] MaterialDTO request)
        {
            var material = await _context.Materials.FindAsync(id);
            if (material == null) return NotFound();

            // Обновляем только разрешенные поля
            material.Name = request.Name;
            material.Description = request.Description;
            material.Type = request.Type;
            material.Unit = request.Unit;
            material.Quantity = request.Quantity;
            material.MinQuantity = request.MinQuantity;
            material.MaxQuantity = request.MaxQuantity;
            material.StorageLocation = request.StorageLocation;
            material.BatchNumber = request.BatchNumber;
            material.ExpiryDate = request.ExpiryDate;
            material.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Material updated" });
        }

        // POST /api/materials/routes
        [HttpPost("routes")]
        public async Task<IActionResult> AddRouteStep([FromBody] RouteStepDTO request)
        {
            var material = await _context.Materials.FindAsync(request.MaterialId);
            if (material == null) return NotFound();

            var routeStep = new MaterialRouteStep
            {
                MaterialId = request.MaterialId,
                StepType = request.StepType,
                FromLocation = request.FromLocation,
                ToLocation = request.ToLocation,
                Quantity = request.Quantity,
                ProductionOrderId = request.ProductionOrderId,
                UnitId = request.UnitId,
                Notes = request.Notes,
                CreatedBy = User.Identity?.Name ?? "System"
            };

            // Обновляем статус материала в зависимости от типа шага
            material.Status = request.StepType switch
            {
                RouteStepType.Поступление => MaterialStatus.ВПоступлении,
                RouteStepType.Перемещение => MaterialStatus.НаСкладе,
                RouteStepType.Резервирование => MaterialStatus.Зарезервирован,
                RouteStepType.Использование => MaterialStatus.ВПроизводстве,
                RouteStepType.Списание => MaterialStatus.Списан,
                _ => material.Status
            };

            // Обновляем количество материала
            if (request.StepType == RouteStepType.Использование ||
                request.StepType == RouteStepType.Списание)
            {
                material.Quantity -= request.Quantity;
            }

            material.UpdatedAt = DateTime.UtcNow;

            _context.MaterialRouteSteps.Add(routeStep);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Route step added" });
        }

        // GET /api/materials/{id}/route
        [HttpGet("{id}/route")]
        public async Task<IActionResult> GetMaterialRoute(int id)
        {
            var routeSteps = await _context.MaterialRouteSteps
                .Where(r => r.MaterialId == id)
                .OrderBy(r => r.CreatedAt)
                .ToListAsync();

            return Ok(routeSteps.Select(r => new
            {
                r.Id,
                r.StepType,
                r.FromLocation,
                r.ToLocation,
                r.Quantity,
                r.ProductionOrderId,
                r.UnitId,
                r.Notes,
                r.CreatedAt,
                r.CreatedBy
            }));
        }

        private string GenerateMaterialNumber()
        {
            return $"MAT-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}";
        }
    }
}