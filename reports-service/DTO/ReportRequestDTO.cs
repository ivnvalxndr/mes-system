namespace reports_service.DTO;

public class ReportRequestDTO
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string ReportType { get; set; } = string.Empty; // "production", "material", "unit"
    public string Format { get; set; } = "json"; // "json", "csv", "pdf"
}