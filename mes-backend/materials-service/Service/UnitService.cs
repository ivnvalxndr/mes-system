using materials_service.DTO;
using materials_service.Repositories.Interfaces;
using materials_service.Service.Interfaces;
using materials_service.Entities;
using materials_service.DTOTranslators;

namespace materials_service.Services;

public class UnitService : IUnitService
{
    private readonly IUnitRepository _repository;

    public UnitService(IUnitRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<UnitDTO>> GetAllUnitsAsync()
    {
        var units = await _repository.GetAllAsync();
        return units.Select(MaterialDTOTranslator.ToDTO);
    }

    public async Task<UnitDTO?> GetUnitByIdAsync(int id)
    {
        var unit = await _repository.GetByIdAsync(id);
        return unit != null ? MaterialDTOTranslator.ToDTO(unit) : null;
    }

    public async Task<UnitDTO> CreateUnitAsync(CreateUnitDTO createDTO)
    {
        var unit = MaterialDTOTranslator.ToEntity(createDTO);
        var created = await _repository.CreateAsync(unit);
        return MaterialDTOTranslator.ToDTO(created);
    }

    public async Task<UnitDTO> UpdateUnitAsync(int id, UpdateUnitDTO updateDTO)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            throw new KeyNotFoundException($"Unit with id {id} not found");

        MaterialDTOTranslator.UpdateEntity(updateDTO, existing);
        var updated = await _repository.UpdateAsync(existing);
        return MaterialDTOTranslator.ToDTO(updated);
    }

    public async Task DeleteUnitAsync(int id)
    {
        var unit = await _repository.GetByIdAsync(id);
        if (unit == null)
            throw new KeyNotFoundException($"Unit with id {id} not found");

        await _repository.DeleteAsync(id);
    }
}