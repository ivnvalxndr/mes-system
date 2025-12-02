using System.ComponentModel.DataAnnotations;

namespace ProductionService.Entities;

public class ProductionPlan
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string PlanName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime PlanDate { get; set; }

    public string OrdersData { get; set; } = "[]";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = string.Empty;
}