namespace materials_service.Entities.Enums;

public enum MaterialStatus
{
    PendingReceipt,    // В поступлении
    InStock,           // На складе
    InProduction,      // В производстве
    Reserved,          // Зарезервирован
    WrittenOff         // Списан
}