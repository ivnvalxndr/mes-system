namespace reports_service.DTO;

public class MaterialUsageDTO
{
    public int TotalMaterials { get; set; }
    public int LowStockMaterials { get; set; }
    public Dictionary<string, decimal> MaterialUsageByType { get; set; } = new();
    public List<MaterialStockDTO> LowStockItems { get; set; } = new();
}