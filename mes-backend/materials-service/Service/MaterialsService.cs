using materials_service.DTO;
using materials_service.Repositories.Interfaces;
using materials_service.Service.Interfaces;
using materials_service.Entities;
using Microsoft.EntityFrameworkCore;
using materials_service.DTOTranslators;

namespace materials_service.Services;

public class MaterialsService : IMaterialsService
{
    private readonly IMaterialsRepository _repository;
    private readonly IUnitRepository _unitRepository;

    public MaterialsService(
        IMaterialsRepository repository,
        IUnitRepository unitRepository)
    {
        _repository = repository;
        _unitRepository = unitRepository;
    }

    public async Task<IEnumerable<MaterialDTO>> GetAllMaterialsAsync()
    {
        var materials = await _repository.GetAllAsync();
        return MaterialDTOTranslator.ToDTOs(materials);
    }

    public async Task<MaterialDTO?> GetMaterialByIdAsync(int id)
    {
        var material = await _repository.GetByIdAsync(id, includeChildren: true);
        return material != null ? MaterialDTOTranslator.ToDTO(material) : null;
    }

    public async Task<IEnumerable<MaterialSimpleDTO>> SearchMaterialsAsync(string? code, string? name)
    {
        var materials = await _repository.SearchAsync(code, name);
        return materials.Select(m => new MaterialSimpleDTO
        {
            Id = m.Id,
            Code = m.Code,
            Name = m.Name
        });
    }

    public async Task<MaterialDTO> CreateMaterialAsync(CreateMaterialDTO createDTO)
    {
        // Валидация
        if (await _repository.CodeExistsAsync(createDTO.Code))
        {
            throw new ArgumentException("Material with this code already exists");
        }

        if (createDTO.ParentId.HasValue)
        {
            var parentExists = await _repository.ExistsAsync(createDTO.ParentId.Value);
            if (!parentExists)
            {
                throw new ArgumentException("Parent material not found");
            }
        }

        var unitExists = await _unitRepository.ExistsAsync(createDTO.UnitId);
        if (!unitExists)
        {
            throw new ArgumentException("Unit not found");
        }

        var material = MaterialDTOTranslator.ToEntity(createDTO);
        var created = await _repository.CreateAsync(material);
        return MaterialDTOTranslator.ToDTO(created);
    }

    public async Task<MaterialDTO> UpdateMaterialAsync(int id, UpdateMaterialDTO updateDTO)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            throw new KeyNotFoundException($"Материал с ид: {id} не найден!");

        // Валидация кода
        if (!string.IsNullOrEmpty(updateDTO.Code) && updateDTO.Code != existing.Code)
        {
            if (await _repository.CodeExistsAsync(updateDTO.Code, id))
                throw new ArgumentException("Material with this code already exists");
        }

        // Валидация родителя
        if (updateDTO.ParentId.HasValue)
        {
            if (updateDTO.ParentId == id)
                throw new ArgumentException("Material cannot be its own parent");

            var parentExists = await _repository.ExistsAsync(updateDTO.ParentId.Value);
            if (!parentExists)
                throw new ArgumentException("Parent material not found");
        }

        // Валидация единицы измерения
        if (updateDTO.UnitId.HasValue)
        {
            var unitExists = await _unitRepository.ExistsAsync(updateDTO.UnitId.Value);
            if (!unitExists)
                throw new ArgumentException("Unit not found");
        }

        MaterialDTOTranslator.UpdateEntity(updateDTO, existing);
        var updated = await _repository.UpdateAsync(existing);
        return MaterialDTOTranslator.ToDTO(updated);
    }

    public async Task DeleteMaterialAsync(int id)
    {
        var material = await _repository.GetByIdAsync(id, includeChildren: true);
        if (material == null)
            throw new KeyNotFoundException($"Материал с ид: {id} не найден!");

        if (material.Children?.Any() == true)
            throw new InvalidOperationException("Cannot delete material with children");

        // Проверка зависимостей (например, шаги маршрута)
        var hasDependencies = await _repository.HasDependenciesAsync(id);
        if (hasDependencies)
            throw new InvalidOperationException("Cannot delete material with dependencies");

        await _repository.DeleteAsync(id);
    }
}