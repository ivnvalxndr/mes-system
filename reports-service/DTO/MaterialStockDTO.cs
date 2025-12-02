namespace reports_service.DTO;

public class MaterialStockDTO
{
    public string MaterialName { get; set; } = string.Empty;
    public decimal CurrentQuantity { get; set; }
    public decimal MinQuantity { get; set; }
    public string Status { get; set; } = string.Empty;
}