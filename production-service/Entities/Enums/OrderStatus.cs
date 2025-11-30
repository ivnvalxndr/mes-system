namespace ProductionService.Entities.Enums;

public enum OrderStatus
{
    Draft = 0,          // Черновик
    Planned = 1,        // Запланирован 
    InProgress = 2,     // В Работе 
    Completed = 3,      // Завершен
    Cancelled = 4       // Отменен 
}