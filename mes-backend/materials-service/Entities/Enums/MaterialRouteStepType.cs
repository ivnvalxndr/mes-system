namespace materials_service.Entities.Enums;

public enum MaterialRouteStepType
{
    Receipt,        // Поступление
    Registration,   // Регистрация
    Transfer,       // Перемещение
    Consumption,    // Расход
    Return,         // Возврат
    WriteOff        // Списание
}