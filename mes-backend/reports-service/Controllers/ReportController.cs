using Microsoft.AspNetCore.Mvc;
using reports_service.DTO;
using reports_service.Services;

namespace ReportService.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly ILogger<ReportController> _logger;

        public ReportController(IReportService reportService, ILogger<ReportController> logger)
        {
            _reportService = reportService;
            _logger = logger;
        }

        // GET /api/reports/kpi
        [HttpGet("kpi")]
        public async Task<IActionResult> GetKPI()
        {
            try
            {
                var kpi = await _reportService.GetKPIAsync();
                return Ok(kpi);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting KPI");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST /api/reports
        [HttpPost]
        public async Task<IActionResult> GenerateReport([FromBody] ReportRequestDTO request)
        {
            try
            {
                var reportData = await _reportService.GenerateReportAsync(request);

                if (reportData.Length == 0)
                    return BadRequest("Failed to generate report");

                var contentType = request.Format switch
                {
                    "json" => "application/json",
                    "csv" => "text/csv",
                    "pdf" => "application/pdf",
                    _ => "application/json"
                };

                var fileName = $"report_{request.ReportType}_{DateTime.UtcNow:yyyyMMddHHmmss}.{request.Format}";

                return File(reportData, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating report");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET /api/reports/production-stats
        [HttpGet("production-stats")]
        public async Task<IActionResult> GetProductionStats(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var stats = await _reportService.GetProductionStatsAsync(start, end);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting production stats");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET /api/reports/material-usage
        [HttpGet("material-usage")]
        public async Task<IActionResult> GetMaterialUsage()
        {
            try
            {
                var usage = await _reportService.GetMaterialUsageAsync();
                return Ok(usage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting material usage");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET /api/reports/unit-performance
        [HttpGet("unit-performance")]
        public async Task<IActionResult> GetUnitPerformance()
        {
            try
            {
                var performance = await _reportService.GetUnitPerformanceAsync();
                return Ok(performance);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting unit performance");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}