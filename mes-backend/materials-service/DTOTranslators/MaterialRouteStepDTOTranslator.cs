// materials-service/DTOTranslators/MaterialRouteStepDTOTranslator.cs
using materials_service.DTO;
using materials_service.Entities;

namespace materials_service.DTOTranslators;

public static class MaterialRouteStepDTOTranslator
{
    // MaterialRouteStep → MaterialRouteStepDTO
    public static MaterialRouteStepDTO ToDTO(MaterialRouteStep step)
    {
        if (step == null)
            throw new ArgumentNullException(nameof(step));

        return new MaterialRouteStepDTO
        {
            Id = step.Id,
            MaterialId = step.MaterialId,
            StepType = step.StepType,
            FromLocation = step.FromLocation,
            ToLocation = step.ToLocation,
            Quantity = step.Quantity,
            UnitId = step.UnitId,
            Notes = step.Notes,
            CreatedAt = step.CreatedAt
        };
    }

    // IEnumerable<MaterialRouteStep> → IEnumerable<MaterialRouteStepDTO>
    public static IEnumerable<MaterialRouteStepDTO> ToDTOs(IEnumerable<MaterialRouteStep> steps)
    {
        return steps.Select(ToDTO);
    }

    // CreateMaterialRouteStepDTO → MaterialRouteStep
    public static MaterialRouteStep ToEntity(CreateMaterialRouteStepDTO createDTO)
    {
        if (createDTO == null)
            throw new ArgumentNullException(nameof(createDTO));

        return new MaterialRouteStep
        {
            MaterialId = createDTO.MaterialId,
            StepType = createDTO.StepType,
            FromLocation = createDTO.FromLocation,
            ToLocation = createDTO.ToLocation,
            Quantity = createDTO.Quantity,
            UnitId = createDTO.UnitId,
            Notes = createDTO.Notes,
            CreatedAt = DateTime.UtcNow
        };
    }

    // MaterialRouteStepDTO → MaterialRouteStep
    public static MaterialRouteStep ToEntity(MaterialRouteStepDTO dto)
    {
        if (dto == null)
            throw new ArgumentNullException(nameof(dto));

        return new MaterialRouteStep
        {
            Id = dto.Id,
            MaterialId = dto.MaterialId,
            StepType = dto.StepType,
            FromLocation = dto.FromLocation,
            ToLocation = dto.ToLocation,
            Quantity = dto.Quantity,
            UnitId = dto.UnitId,
            Notes = dto.Notes,
            CreatedAt = dto.CreatedAt
        };
    }

    // MaterialRouteStepDTO → MaterialRouteStep (только обновление полей)
    public static void UpdateEntity(MaterialRouteStepDTO dto, MaterialRouteStep step)
    {
        if (dto == null)
            throw new ArgumentNullException(nameof(dto));

        if (step == null)
            throw new ArgumentNullException(nameof(step));

        step.StepType = dto.StepType;
        step.FromLocation = dto.FromLocation;
        step.ToLocation = dto.ToLocation;
        step.Quantity = dto.Quantity;
        step.UnitId = dto.UnitId;
        step.Notes = dto.Notes;
        // CreatedAt не обновляем - это дата создания
        // Id и MaterialId не обновляем - это ключи
    }
}