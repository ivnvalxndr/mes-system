using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductionService.Data;
using ProductionService.Entities;
using ProductionService.Entities.Enums;
using ProductionService.DTO;

namespace ProductionService.Controllers
{
    [ApiController]
    [Route("api/production")]
    public class ProductionController : ControllerBase
    {
        private readonly ProductionDbContext _context;
        private readonly ILogger<ProductionController> _logger;

        public ProductionController(ProductionDbContext context, ILogger<ProductionController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST /api/production/orders
        [HttpPost("orders")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDTO request)
        {
            var order = new ProductionOrder
            {
                OrderNumber = GenerateOrderNumber(),
                ProductName = request.ProductName,
                Description = request.Description,
                Quantity = request.Quantity,
                Status = OrderStatus.Draft,
                PlannedStartDate = request.PlannedStartDate,
                PlannedEndDate = request.PlannedEndDate,
                Priority = request.Priority,
                MaterialId = request.MaterialId,
                UnitId = request.UnitId,
                CreatedBy = User.Identity?.Name ?? "System"
            };

            _context.ProductionOrders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new OrderDTO
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                ProductName = order.ProductName,
                Description = order.Description,
                Quantity = order.Quantity,
                Status = order.Status,
                PlannedStartDate = order.PlannedStartDate,
                PlannedEndDate = order.PlannedEndDate,
                Priority = order.Priority,
                MaterialId = order.MaterialId,
                UnitId = order.UnitId,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                CreatedBy = order.CreatedBy
            });
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.ProductionOrders.ToListAsync();

            var response = orders.Select(o => new OrderDTO
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                ProductName = o.ProductName,
                Description = o.Description,
                Quantity = o.Quantity,
                Status = o.Status,
                PlannedStartDate = o.PlannedStartDate,
                PlannedEndDate = o.PlannedEndDate,
                ActualStartDate = o.ActualStartDate,
                ActualEndDate = o.ActualEndDate,
                Priority = o.Priority,
                MaterialId = o.MaterialId,
                UnitId = o.UnitId,
                CreatedAt = o.CreatedAt,
                UpdatedAt = o.UpdatedAt,
                CreatedBy = o.CreatedBy
            });

            return Ok(response);
        }

        [HttpGet("orders/{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.ProductionOrders.FindAsync(id);
            if (order == null) return NotFound();

            return Ok(new OrderDTO
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                ProductName = order.ProductName,
                Description = order.Description,
                Quantity = order.Quantity,
                Status = order.Status,
                PlannedStartDate = order.PlannedStartDate,
                PlannedEndDate = order.PlannedEndDate,
                ActualStartDate = order.ActualStartDate,
                ActualEndDate = order.ActualEndDate,
                Priority = order.Priority,
                MaterialId = order.MaterialId,
                UnitId = order.UnitId,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                CreatedBy = order.CreatedBy
            });
        }

        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatus status)
        {
            var order = await _context.ProductionOrders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;

            if (status == OrderStatus.InProgress && order.ActualStartDate == null)
                order.ActualStartDate = DateTime.UtcNow;
            else if (status == OrderStatus.Completed && order.ActualEndDate == null)
                order.ActualEndDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Status updated" });
        }

        private string GenerateOrderNumber()
        {
            return $"PO-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
        }
    }
}