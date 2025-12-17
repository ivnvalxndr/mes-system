using materials_service.DTO;
using materials_service.Entities;
using units_service.Entities.Enums;
using units_service.Entities;

namespace materials_service.DTOTranslators;

public static class MaterialDTOTranslator
{
    public static MaterialDTO ToDTO(Material material)
    {
        if (material == null)
            throw new ArgumentNullException(nameof(material));

        return new MaterialDTO
        {
            Id = material.Id,
            Code = material.Code,
            Name = material.Name,
            Description = material.Description,
            ParentId = material.ParentId,
            UnitId = material.UnitId,
            Pcs = material.Pcs,
            Mts = material.Mts,
            Tns = material.Tns,
            Unit = material.Unit != null ? UnitDTOTranslator.ToDTO(material.Unit) : null,
            Parent = material.Parent != null ? ToSimpleDTO(material.Parent) : null,
            Children = material.Children?
                .Select(ToSimpleDTO)
                .ToList() ?? new List<MaterialSimpleDTO>(),
            RouteSteps = material.RouteSteps?
                .Select(MaterialRouteStepDTOTranslator.ToDTO)
                .ToList() ?? new List<MaterialRouteStepDTO>()
        };
    }

    // Material → MaterialSimpleDTO (для вложенных объектов)
    public static MaterialSimpleDTO ToSimpleDTO(Material material)
    {
        if (material == null)
            throw new ArgumentNullException(nameof(material));

        return new MaterialSimpleDTO
        {
            Id = material.Id,
            Code = material.Code,
            Name = material.Name
        };
    }

    // IEnumerable<Material> → IEnumerable<MaterialDTO> (коллекция)
    public static IEnumerable<MaterialDTO> ToDTOs(IEnumerable<Material> materials)
    {
        return materials.Select(ToDTO);
    }

    // IEnumerable<Material> → IEnumerable<MaterialSimpleDTO> (коллекция простых DTO)
    public static IEnumerable<MaterialSimpleDTO> ToSimpleDTOs(IEnumerable<Material> materials)
    {
        return materials.Select(ToSimpleDTO);
    }

    // CreateMaterialDTO → Material
    public static Material ToEntity(CreateMaterialDTO createDTO)
    {
        if (createDTO == null)
            throw new ArgumentNullException(nameof(createDTO));

        return new Material
        {
            Code = createDTO.Code,
            Name = createDTO.Name,
            Description = createDTO.Description,
            ParentId = createDTO.ParentId,
            UnitId = createDTO.UnitId,
            Pcs = createDTO.Pcs,
            Mts = createDTO.Mts,
            Tns = createDTO.Tns,
            Children = new List<Material>(),
            RouteSteps = new List<MaterialRouteStep>()
        };
    }

    // UpdateMaterialDTO → Обновление существующего Material
    public static void UpdateEntity(UpdateMaterialDTO updateDTO, Material material)
    {
        if (updateDTO == null)
            throw new ArgumentNullException(nameof(updateDTO));

        if (material == null)
            throw new ArgumentNullException(nameof(material));

        // Обновляем только те поля, которые пришли (не null)
        if (!string.IsNullOrEmpty(updateDTO.Code))
            material.Code = updateDTO.Code;

        if (!string.IsNullOrEmpty(updateDTO.Name))
            material.Name = updateDTO.Name;

        if (updateDTO.Description != null)
            material.Description = updateDTO.Description;

        if (updateDTO.ParentId.HasValue)
            material.ParentId = updateDTO.ParentId.Value;

        if (updateDTO.UnitId.HasValue)
            material.UnitId = updateDTO.UnitId.Value;

        if (updateDTO.Pcs.HasValue)
            material.Pcs = updateDTO.Pcs.Value;

        if (updateDTO.Mts.HasValue)
            material.Mts = updateDTO.Mts.Value;

        if (updateDTO.Tns.HasValue)
            material.Tns = updateDTO.Tns.Value;
    }

    public static UnitDTO ToDTO(Unit unit)
    {
        if (unit == null) return null!;

        return new UnitDTO
        {
            Id = unit.Id,
            Code = unit.Code.ToString(),
            Name = unit.Name,
            Description = unit.Description,
            Type = unit.Type.ToString(),
            Status = unit.Status.ToString()
        };
    }

    public static Unit ToEntity(CreateUnitDTO dto)
    {
        return new Unit
        {
            Code = Convert.ToInt32(dto.Code),
            Name = dto.Name,
            Description = dto.Description!,
            Type = Enum.Parse<UnitType>(dto.Type),
            Status = UnitStatus.Available // Используем Available как в модели
        };
    }

    public static void UpdateEntity(UpdateUnitDTO dto, Unit entity)
    {
        if (!string.IsNullOrEmpty(dto.Name))
            entity.Name = dto.Name;

        if (dto.Description != null)
            entity.Description = dto.Description;

        if (!string.IsNullOrEmpty(dto.Type))
            entity.Type = Enum.Parse<UnitType>(dto.Type);

        if (!string.IsNullOrEmpty(dto.Status))
            entity.Status = Enum.Parse<UnitStatus>(dto.Status);
    }
}