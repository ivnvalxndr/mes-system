using System.ComponentModel.DataAnnotations;
using ProductionService.Entities.Enums;

namespace ProductionService.Entities
{
    public class ProductionOrder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string OrderNumber { get; set; } = string.Empty;

        [Required]
        public string ProductName { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        public int Quantity { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Draft;

        public DateTime PlannedStartDate { get; set; }
        public DateTime PlannedEndDate { get; set; }

        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }

        public int Priority { get; set; } = 1;

        public string? MaterialId { get; set; }
        public string? UnitId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
    }
}
