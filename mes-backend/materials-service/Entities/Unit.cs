using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using units_service.Entities.Enums;

namespace units_service.Entities;

[Table("unit")]
public class Unit
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int Code { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;

    [Required]
    public UnitType Type { get; set; }

    public UnitStatus Status { get; set; } = UnitStatus.Available;
}