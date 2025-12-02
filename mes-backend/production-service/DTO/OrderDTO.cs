using System.ComponentModel.DataAnnotations;
using ProductionService.Entities.Enums;

namespace ProductionService.DTO
{
    public class OrderDTO
    {
        public int Id { get; set; }

        // Read-only поля (только для ответа)
        public string OrderNumber { get; set; } = string.Empty;
        public OrderStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }

        // Поля для создания/обновления
        [Required]
        public string ProductName { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        public DateTime PlannedStartDate { get; set; }
        public DateTime PlannedEndDate { get; set; }

        [Range(1, 5)]
        public int Priority { get; set; } = 1;

        public string? MaterialId { get; set; }
        public string? UnitId { get; set; }
    }
}