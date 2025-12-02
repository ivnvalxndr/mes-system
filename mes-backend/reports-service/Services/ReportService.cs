using reports_service.DTO;
using reports_service.Services;
using System.Text.Json;

namespace reports_service.Services
{
    public class ReportService : IReportService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ReportService> _logger;

        public ReportService(HttpClient httpClient, IConfiguration configuration, ILogger<ReportService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<ProductionStatsDTO> GetProductionStatsAsync(DateTime startDate, DateTime endDate)
        {
            try
            {
                var productionServiceUrl = _configuration["Services:ProductionService"];
                var response = await _httpClient.GetAsync($"{productionServiceUrl}/api/production/orders");

                if (response.IsSuccessStatusCode)
                {
                    using var stream = await response.Content.ReadAsStreamAsync();
                    var orders = await JsonSerializer.DeserializeAsync<List<Dictionary<string, JsonElement>>>(stream);

                    if (orders == null)
                        return new ProductionStatsDTO();

                    var filteredOrders = orders.Where(o =>
                    {
                        if (o.TryGetValue("createdAt", out var createdAtElement))
                        {
                            var createdAt = DateTime.Parse(createdAtElement.GetString()!);
                            return createdAt >= startDate && createdAt <= endDate;
                        }
                        return false;
                    }).ToList();

                    var stats = new ProductionStatsDTO
                    {
                        TotalOrders = filteredOrders.Count,
                        CompletedOrders = filteredOrders.Count(o =>
                            o.TryGetValue("status", out var statusElement) &&
                            statusElement.GetString() == "Completed"),
                        InProgressOrders = filteredOrders.Count(o =>
                            o.TryGetValue("status", out var statusElement) &&
                            statusElement.GetString() == "InProgress")
                    };

                    // Группировка по статусу
                    var ordersByStatus = new Dictionary<string, int>();
                    foreach (var order in filteredOrders)
                    {
                        if (order.TryGetValue("status", out var statusElement))
                        {
                            var status = statusElement.GetString()!;
                            if (ordersByStatus.ContainsKey(status))
                                ordersByStatus[status]++;
                            else
                                ordersByStatus[status] = 1;
                        }
                    }

                    stats.OrdersByStatus = ordersByStatus;
                    stats.CompletionRate = stats.TotalOrders > 0 ?
                        (decimal)stats.CompletedOrders / stats.TotalOrders * 100 : 0;

                    return stats;
                }

                _logger.LogWarning("Failed to get production stats");
                return new ProductionStatsDTO();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting production stats");
                return new ProductionStatsDTO();
            }
        }

        public async Task<MaterialUsageDTO> GetMaterialUsageAsync()
        {
            try
            {
                var materialServiceUrl = _configuration["Services:MaterialService"];
                var response = await _httpClient.GetAsync($"{materialServiceUrl}/api/materials");

                if (response.IsSuccessStatusCode)
                {
                    using var stream = await response.Content.ReadAsStreamAsync();
                    var materials = await JsonSerializer.DeserializeAsync<List<Dictionary<string, JsonElement>>>(stream);

                    if (materials == null)
                        return new MaterialUsageDTO();

                    var usage = new MaterialUsageDTO
                    {
                        TotalMaterials = materials.Count,
                        LowStockMaterials = 0,
                        MaterialUsageByType = new Dictionary<string, decimal>(),
                        LowStockItems = new List<MaterialStockDTO>()
                    };

                    foreach (var material in materials)
                    {
                        // Получаем значения
                        var quantity = material.TryGetValue("quantity", out var q) ? q.GetDecimal() : 0;
                        var minQuantity = material.TryGetValue("minQuantity", out var mq) ? mq.GetDecimal() : 0;
                        var materialType = material.TryGetValue("type", out var t) ? t.GetString()! : "Unknown";
                        var materialName = material.TryGetValue("name", out var n) ? n.GetString()! : "Unknown";

                        // Проверяем низкий запас
                        if (quantity <= minQuantity)
                        {
                            usage.LowStockMaterials++;
                            usage.LowStockItems.Add(new MaterialStockDTO
                            {
                                MaterialName = materialName,
                                CurrentQuantity = quantity,
                                MinQuantity = minQuantity,
                                Status = quantity <= minQuantity * 0.5m ? "Critical" : "Low"
                            });
                        }

                        // Суммируем по типам
                        if (usage.MaterialUsageByType.ContainsKey(materialType))
                            usage.MaterialUsageByType[materialType] += quantity;
                        else
                            usage.MaterialUsageByType[materialType] = quantity;
                    }

                    return usage;
                }

                _logger.LogWarning("Failed to get material usage");
                return new MaterialUsageDTO();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting material usage");
                return new MaterialUsageDTO();
            }
        }

        public async Task<UnitPerformanceDTO> GetUnitPerformanceAsync()
        {
            try
            {
                var unitServiceUrl = _configuration["Services:UnitService"];
                var response = await _httpClient.GetAsync($"{unitServiceUrl}/api/units");

                if (response.IsSuccessStatusCode)
                {
                    using var stream = await response.Content.ReadAsStreamAsync();
                    var units = await JsonSerializer.DeserializeAsync<List<Dictionary<string, JsonElement>>>(stream);

                    if (units == null)
                        return new UnitPerformanceDTO();

                    var performance = new UnitPerformanceDTO
                    {
                        TotalUnits = units.Count,
                        AvailableUnits = 0,
                        InUseUnits = 0,
                        MaintenanceUnits = 0,
                        UnitsByStatus = new Dictionary<string, int>(),
                        OverallUtilization = 0
                    };

                    decimal totalLoad = 0;
                    int unitsWithLoad = 0;

                    foreach (var unit in units)
                    {
                        // Статус оборудования
                        if (unit.TryGetValue("status", out var statusElement))
                        {
                            var status = statusElement.GetString()!;

                            // Считаем по статусам
                            if (status == "Available") performance.AvailableUnits++;
                            else if (status == "InUse") performance.InUseUnits++;
                            else if (status == "Maintenance") performance.MaintenanceUnits++;

                            // Группировка по статусу
                            if (performance.UnitsByStatus.ContainsKey(status))
                                performance.UnitsByStatus[status]++;
                            else
                                performance.UnitsByStatus[status] = 1;
                        }

                        // Загрузка оборудования
                        if (unit.TryGetValue("currentLoad", out var loadElement))
                        {
                            var load = loadElement.ValueKind == JsonValueKind.Number ?
                                loadElement.GetDecimal() : 0;
                            totalLoad += load;
                            unitsWithLoad++;
                        }
                    }

                    // Средняя загрузка
                    performance.OverallUtilization = unitsWithLoad > 0 ?
                        totalLoad / unitsWithLoad : 0;

                    return performance;
                }

                _logger.LogWarning("Failed to get unit performance");
                return new UnitPerformanceDTO();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting unit performance");
                return new UnitPerformanceDTO();
            }
        }

        public async Task<KPIDTO> GetKPIAsync()
        {
            try
            {
                var productionStats = await GetProductionStatsAsync(
                    DateTime.UtcNow.AddDays(-30), DateTime.UtcNow);

                var materialUsage = await GetMaterialUsageAsync();
                var unitPerformance = await GetUnitPerformanceAsync();

                return new KPIDTO
                {
                    OEE = CalculateOEE(productionStats, unitPerformance),
                    ProductionEfficiency = productionStats.CompletionRate,
                    QualityRate = 95.5m,
                    OnTimeDelivery = 92.3m,
                    MaterialUsageEfficiency = CalculateMaterialEfficiency(materialUsage)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating KPI");
                return new KPIDTO();
            }
        }

        public async Task<byte[]> GenerateReportAsync(ReportRequestDTO request)
        {
            try
            {
                object reportData = request.ReportType switch
                {
                    "production" => await GetProductionStatsAsync(request.StartDate, request.EndDate),
                    "material" => await GetMaterialUsageAsync(),
                    "unit" => await GetUnitPerformanceAsync(),
                    "kpi" => await GetKPIAsync(),
                    _ => new { Error = "Unknown report type" }
                };

                return request.Format switch
                {
                    "json" => JsonSerializer.SerializeToUtf8Bytes(reportData),
                    "csv" => GenerateCsv(reportData),
                    _ => JsonSerializer.SerializeToUtf8Bytes(reportData)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating report");
                return Array.Empty<byte>();
            }
        }

        private decimal CalculateOEE(ProductionStatsDTO productionStats, UnitPerformanceDTO unitPerformance)
        {
            var availability = unitPerformance.TotalUnits > 0 ?
                (decimal)unitPerformance.AvailableUnits / unitPerformance.TotalUnits * 100 : 0;

            var performance = unitPerformance.OverallUtilization;
            var quality = productionStats.CompletionRate;

            return (availability * performance * quality) / 10000m;
        }

        private decimal CalculateMaterialEfficiency(MaterialUsageDTO materialUsage)
        {
            if (materialUsage.TotalMaterials == 0) return 0;

            var efficiency = (decimal)(materialUsage.TotalMaterials - materialUsage.LowStockMaterials)
                           / materialUsage.TotalMaterials * 100;
            return efficiency;
        }

        private byte[] GenerateCsv(object data)
        {
            var csv = new List<string>();

            if (data is ProductionStatsDTO productionStats)
            {
                csv.Add("Metric,Value");
                csv.Add($"Total Orders,{productionStats.TotalOrders}");
                csv.Add($"Completed Orders,{productionStats.CompletedOrders}");
                csv.Add($"Completion Rate,{productionStats.CompletionRate}%");
            }

            return System.Text.Encoding.UTF8.GetBytes(string.Join("\n", csv));
        }
    }
}