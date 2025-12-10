using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using materials_service.Entities.Enums;
using units_service.Entities;

namespace materials_service.Entities;

[Table("material_route_steps")] // Исправлена опечатка в названии таблицы (rote -> route)
public class MaterialRouteStep
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("material_id")]
    public int MaterialId { get; set; }

    [Required]
    [Column("step_type")]
    public MaterialRouteStepType StepType { get; set; }

    [Required]
    [MaxLength(200)]
    [Column("from_location")]
    public string FromLocation { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    [Column("to_location")]
    public string ToLocation { get; set; } = string.Empty;

    // Единица измерения
    [Column("unit_id")]
    public int? UnitId { get; set; }

    // Дата операции
    [Required]
    [Column("operation_date")]
    public DateTime OperationDate { get; set; }

    // Количество в штуках
    [Column("pcs")]
    public decimal? Pcs { get; set; }

    // Количество в метрах
    [Column("mts")]
    public decimal? Mts { get; set; }

    // Количество в тоннах
    [Column("tns")]
    public decimal? Tns { get; set; }

    [MaxLength(1000)]
    [Column("notes")]
    public string Notes { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Навигационные свойства
    [ForeignKey("MaterialId")]
    public Material Material { get; set; } = null!;

    [ForeignKey("UnitId")]
    public Unit? Unit { get; set; }
}