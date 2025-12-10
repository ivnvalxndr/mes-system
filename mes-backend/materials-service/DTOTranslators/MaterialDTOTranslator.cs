// materials-service/DTOTranslators/MaterialDTOTranslator.cs
using materials_service.DTO;
using materials_service.Entities;

namespace materials_service.DTOTranslators;

public static class MaterialDTOTranslator
{
    // Material → MaterialDTO
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
            Quantity = material.Quantity,
            Price = material.Price,
            UnitId = material.UnitId,
            TotalValue = material.TotalValue,
            RouteSteps = material.RouteSteps?
                .Select(MaterialRouteStepDTOTranslator.ToDTO)
                .ToList() ?? new List<MaterialRouteStepDTO>()
        };
    }

    // IEnumerable<Material> → IEnumerable<MaterialDTO> (коллекция)
    public static IEnumerable<MaterialDTO> ToDTOs(IEnumerable<Material> materials)
    {
        return materials.Select(ToDTO);
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
            Quantity = createDTO.Quantity,
            Price = createDTO.Price,
            UnitId = createDTO.UnitId,
            RouteSteps = new List<MaterialRouteStep>()
        };
    }


    public static void UpdateEntity(UpdateMaterialDTO updateDTO, Material material)
    {
        if (updateDTO == null)
            throw new ArgumentNullException(nameof(updateDTO));

        if (material == null)
            throw new ArgumentNullException(nameof(material));

        // Обновляем только те поля, которые пришли (не null)
        if (updateDTO.Name != null)
            material.Name = updateDTO.Name;

        if (updateDTO.Description != null)
            material.Description = updateDTO.Description;

        if (updateDTO.Quantity.HasValue)
            material.Quantity = updateDTO.Quantity.Value;

        if (updateDTO.Price.HasValue)
            material.Price = updateDTO.Price.Value;

        if (updateDTO.UnitId.HasValue)
            material.UnitId = updateDTO.UnitId.Value;
    }

}