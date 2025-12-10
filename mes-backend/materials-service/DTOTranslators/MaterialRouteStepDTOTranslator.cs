using materials_service.DTO;
using materials_service.Entities;
using materials_service.Entities.Enums;

namespace materials_service.DTOTranslators;

public static class MaterialRouteStepDTOTranslator
{
    // MaterialRouteStep → MaterialRouteStepDTO
    public static MaterialRouteStepDTO ToDTO(MaterialRouteStep routeStep)
    {
        if (routeStep == null)
            throw new ArgumentNullException(nameof(routeStep));

        return new MaterialRouteStepDTO
        {
            Id = routeStep.Id,
            MaterialId = routeStep.MaterialId,
            StepType = routeStep.StepType.ToString(),
            FromLocation = routeStep.FromLocation,
            ToLocation = routeStep.ToLocation,
            UnitId = routeStep.UnitId,
            OperationDate = routeStep.OperationDate,
            Pcs = routeStep.Pcs,
            Mts = routeStep.Mts,
            Tns = routeStep.Tns,
            Notes = routeStep.Notes,
            CreatedAt = routeStep.CreatedAt,
            Material = routeStep.Material != null ?
                new MaterialSimpleDTO
                {
                    Id = routeStep.Material.Id,
                    Code = routeStep.Material.Code,
                    Name = routeStep.Material.Name
                } : null,
            Unit = routeStep.Unit != null ?
                new UnitDTO
                {
                    Id = routeStep.Unit.Id,
                    Code = routeStep.Unit.Code,
                    Name = routeStep.Unit.Name,
                    Description = routeStep.Unit.Description,
                    Type = routeStep.Unit.Type.ToString(),
                    Status = routeStep.Unit.Status.ToString()
                } : null
        };
    }

    // IEnumerable<MaterialRouteStep> → IEnumerable<MaterialRouteStepDTO> (коллекция)
    public static IEnumerable<MaterialRouteStepDTO> ToDTOs(IEnumerable<MaterialRouteStep> routeSteps)
    {
        if (routeSteps == null)
            return Enumerable.Empty<MaterialRouteStepDTO>();

        return routeSteps.Select(ToDTO);
    }

    // CreateMaterialRouteStepDTO → MaterialRouteStep
    public static MaterialRouteStep ToEntity(CreateMaterialRouteStepDTO createDTO)
    {
        if (createDTO == null)
            throw new ArgumentNullException(nameof(createDTO));

        // Валидация обязательных полей
        if (string.IsNullOrWhiteSpace(createDTO.StepType))
            throw new ArgumentException("StepType is required");

        if (!Enum.TryParse<MaterialRouteStepType>(createDTO.StepType, true, out var stepType))
            throw new ArgumentException($"Invalid step type: {createDTO.StepType}. Valid values: {string.Join(", ", Enum.GetNames(typeof(MaterialRouteStepType)))}");

        if (string.IsNullOrWhiteSpace(createDTO.FromLocation))
            throw new ArgumentException("FromLocation is required");

        if (string.IsNullOrWhiteSpace(createDTO.ToLocation))
            throw new ArgumentException("ToLocation is required");

        // Валидация даты операции
        if (createDTO.OperationDate == default)
            throw new ArgumentException("OperationDate is required");

        if (createDTO.OperationDate > DateTime.UtcNow.AddDays(1))
            throw new ArgumentException("OperationDate cannot be in the future");

        // Валидация количеств
        if (!createDTO.Pcs.HasValue && !createDTO.Mts.HasValue && !createDTO.Tns.HasValue)
            throw new ArgumentException("At least one quantity field must be specified (Pcs, Mts, or Tns)");

        if (createDTO.Pcs.HasValue && createDTO.Pcs.Value < 0)
            throw new ArgumentException("Pcs cannot be negative");

        if (createDTO.Mts.HasValue && createDTO.Mts.Value < 0)
            throw new ArgumentException("Mts cannot be negative");

        if (createDTO.Tns.HasValue && createDTO.Tns.Value < 0)
            throw new ArgumentException("Tns cannot be negative");

        return new MaterialRouteStep
        {
            MaterialId = createDTO.MaterialId,
            StepType = stepType,
            FromLocation = createDTO.FromLocation.Trim(),
            ToLocation = createDTO.ToLocation.Trim(),
            UnitId = createDTO.UnitId, // Может быть null
            OperationDate = createDTO.OperationDate,
            Pcs = createDTO.Pcs,
            Mts = createDTO.Mts,
            Tns = createDTO.Tns,
            Notes = createDTO.Notes?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };
    }

    // UpdateMaterialRouteStepDTO → Обновление существующего MaterialRouteStep
    public static void UpdateEntity(UpdateMaterialRouteStepDTO updateDTO, MaterialRouteStep routeStep)
    {
        if (updateDTO == null)
            throw new ArgumentNullException(nameof(updateDTO));

        if (routeStep == null)
            throw new ArgumentNullException(nameof(routeStep));

        // Обновляем только те поля, которые пришли (не null)
        if (!string.IsNullOrWhiteSpace(updateDTO.StepType))
        {
            if (Enum.TryParse<MaterialRouteStepType>(updateDTO.StepType, true, out var newStepType))
                routeStep.StepType = newStepType;
            else
                throw new ArgumentException($"Invalid step type: {updateDTO.StepType}. Valid values: {string.Join(", ", Enum.GetNames(typeof(MaterialRouteStepType)))}");
        }

        if (!string.IsNullOrWhiteSpace(updateDTO.FromLocation))
            routeStep.FromLocation = updateDTO.FromLocation.Trim();

        if (!string.IsNullOrWhiteSpace(updateDTO.ToLocation))
            routeStep.ToLocation = updateDTO.ToLocation.Trim();

        if (updateDTO.UnitId.HasValue)
            routeStep.UnitId = updateDTO.UnitId.Value; // Может быть null если передано значение

        if (updateDTO.OperationDate.HasValue)
        {
            if (updateDTO.OperationDate.Value > DateTime.UtcNow.AddDays(1))
                throw new ArgumentException("OperationDate cannot be in the future");

            routeStep.OperationDate = updateDTO.OperationDate.Value;
        }

        // Валидация количеств при обновлении
        if (updateDTO.Pcs.HasValue)
        {
            if (updateDTO.Pcs.Value < 0)
                throw new ArgumentException("Pcs cannot be negative");
            routeStep.Pcs = updateDTO.Pcs.Value;
        }

        if (updateDTO.Mts.HasValue)
        {
            if (updateDTO.Mts.Value < 0)
                throw new ArgumentException("Mts cannot be negative");
            routeStep.Mts = updateDTO.Mts.Value;
        }

        if (updateDTO.Tns.HasValue)
        {
            if (updateDTO.Tns.Value < 0)
                throw new ArgumentException("Tns cannot be negative");
            routeStep.Tns = updateDTO.Tns.Value;
        }

        // Проверяем, что после обновления осталось хотя бы одно количество
        if (!routeStep.Pcs.HasValue && !routeStep.Mts.HasValue && !routeStep.Tns.HasValue)
            throw new ArgumentException("At least one quantity field must remain specified (Pcs, Mts, or Tns)");

        if (!string.IsNullOrWhiteSpace(updateDTO.Notes))
            routeStep.Notes = updateDTO.Notes.Trim();
    }

    // Создание DTO из сущности с минимальными данными (для вложенных объектов)
    public static MaterialRouteStepSimpleDTO ToSimpleDTO(MaterialRouteStep routeStep)
    {
        if (routeStep == null)
            throw new ArgumentNullException(nameof(routeStep));

        return new MaterialRouteStepSimpleDTO
        {
            Id = routeStep.Id,
            StepType = routeStep.StepType.ToString(),
            FromLocation = routeStep.FromLocation,
            ToLocation = routeStep.ToLocation,
            OperationDate = routeStep.OperationDate,
            CreatedAt = routeStep.CreatedAt
        };
    }

    // Коллекция простых DTO
    public static IEnumerable<MaterialRouteStepSimpleDTO> ToSimpleDTOs(IEnumerable<MaterialRouteStep> routeSteps)
    {
        if (routeSteps == null)
            return Enumerable.Empty<MaterialRouteStepSimpleDTO>();

        return routeSteps.Select(ToSimpleDTO);
    }
}
