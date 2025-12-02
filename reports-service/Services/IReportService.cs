using reports_service.DTO;

namespace reports_service.Services;

public interface IReportService
{
    Task<ProductionStatsDTO> GetProductionStatsAsync(DateTime startDate, DateTime endDate);
    Task<MaterialUsageDTO> GetMaterialUsageAsync();
    Task<UnitPerformanceDTO> GetUnitPerformanceAsync();
    Task<KPIDTO> GetKPIAsync();
    Task<byte[]> GenerateReportAsync(ReportRequestDTO request);
}