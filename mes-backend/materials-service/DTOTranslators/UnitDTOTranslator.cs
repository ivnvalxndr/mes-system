using materials_service.DTO;
using units_service.Entities;
using units_service.Entities.Enums;

namespace materials_service.DTOTranslators;

public static class UnitDTOTranslator
{
    // Unit → UnitDTO
    public static UnitDTO ToDTO(Unit unit)
    {
        if (unit == null)
            throw new ArgumentNullException(nameof(unit));

        return new UnitDTO
        {
            Id = unit.Id,
            Code = unit.Code,
            Name = unit.Name,
            Description = unit.Description,
            Type = unit.Type.ToString(),
            Status = unit.Status.ToString()
        };
    }

    // IEnumerable<Unit> → IEnumerable<UnitDTO> (коллекция)
    public static IEnumerable<UnitDTO> ToDTOs(IEnumerable<Unit> units)
    {
        return units.Select(ToDTO);
    }

    // CreateUnitDTO → Unit
    public static Unit ToEntity(CreateUnitDTO createDTO)
    {
        if (createDTO == null)
            throw new ArgumentNullException(nameof(createDTO));

        if (!Enum.TryParse<UnitType>(createDTO.Type, out var unitType))
            throw new ArgumentException($"Invalid unit type: {createDTO.Type}");

        return new Unit
        {
            Code = createDTO.Code,
            Name = createDTO.Name,
            Description = createDTO.Description,
            Type = unitType,
            Status = UnitStatus.Available
        };
    }

    // UpdateUnitDTO → Обновление существующего Unit
    public static void UpdateEntity(UpdateUnitDTO updateDTO, Unit unit)
    {
        if (updateDTO == null)
            throw new ArgumentNullException(nameof(updateDTO));

        if (unit == null)
            throw new ArgumentNullException(nameof(unit));

        // Обновляем только те поля, которые пришли (не null)
        if (!string.IsNullOrEmpty(updateDTO.Name))
            unit.Name = updateDTO.Name;

        if (updateDTO.Description != null)
            unit.Description = updateDTO.Description;

        if (!string.IsNullOrEmpty(updateDTO.Type))
        {
            if (Enum.TryParse<UnitType>(updateDTO.Type, out var newType))
                unit.Type = newType;
            else
                throw new ArgumentException($"Invalid unit type: {updateDTO.Type}");
        }

        if (!string.IsNullOrEmpty(updateDTO.Status))
        {
            if (Enum.TryParse<UnitStatus>(updateDTO.Status, out var newStatus))
                unit.Status = newStatus;
            else
                throw new ArgumentException($"Invalid unit status: {updateDTO.Status}");
        }
    }
}