using System.ComponentModel.DataAnnotations;

namespace materials_service.DTO
{
    // Полный DTO для шага маршрута (ответ)
    public class MaterialRouteStepDTO
    {
        public int Id { get; set; }
        public int MaterialId { get; set; }
        public string StepType { get; set; } = string.Empty;
        public string FromLocation { get; set; } = string.Empty;
        public string ToLocation { get; set; } = string.Empty;
        public int? UnitId { get; set; }
        public DateTime OperationDate { get; set; }
        public decimal? Pcs { get; set; }
        public decimal? Mts { get; set; }
        public decimal? Tns { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public MaterialSimpleDTO? Material { get; set; }
        public UnitDTO? Unit { get; set; }
    }

    // DTO для создания шага маршрута (запрос)
    public class CreateMaterialRouteStepDTO
    {
        [Required]
        public int MaterialId { get; set; }

        [Required]
        public string StepType { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string FromLocation { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string ToLocation { get; set; } = string.Empty;

        public int? UnitId { get; set; }

        [Required]
        public DateTime OperationDate { get; set; }

        public decimal? Pcs { get; set; }
        public decimal? Mts { get; set; }
        public decimal? Tns { get; set; }

        [MaxLength(1000)]
        public string Notes { get; set; } = string.Empty;
    }

    // DTO для обновления шага маршрута (запрос)
    public class UpdateMaterialRouteStepDTO
    {
        public string? StepType { get; set; }

        [MaxLength(200)]
        public string? FromLocation { get; set; }

        [MaxLength(200)]
        public string? ToLocation { get; set; }

        public int? UnitId { get; set; }

        public DateTime? OperationDate { get; set; }

        public decimal? Pcs { get; set; }
        public decimal? Mts { get; set; }
        public decimal? Tns { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }

    // Простой DTO для шага маршрута (используется в списках)
    public class MaterialRouteStepSimpleDTO
    {
        public int Id { get; set; }
        public int MaterialId { get; set; }
        public string StepType { get; set; } = string.Empty;
        public string FromLocation { get; set; } = string.Empty;
        public string ToLocation { get; set; } = string.Empty;
        public DateTime OperationDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}