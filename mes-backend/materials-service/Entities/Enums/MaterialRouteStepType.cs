namespace materials_service.Entities.Enums;

public enum MaterialRouteStepType
{
    Receipt,        // Поступление
    Transfer,       // Перемещение
    Consumption,    // Расход
    Return,         // Возврат
    WriteOff        // Списание
}