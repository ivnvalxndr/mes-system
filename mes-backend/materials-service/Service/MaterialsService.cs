using materials_service.DTO;
using materials_service.Repositories;
using materials_service.DTOTranslators;
using materials_service.Repositories.Interfaces;
using materials_service.Service.Interfaces;

namespace materials_service.Services;

public class MaterialsService : IMaterialsService
{
    private readonly IMaterialsRepository _repository;

    public MaterialsService(IMaterialsRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MaterialDTO>> GetAllMaterialsAsync()
    {
        var materials = await _repository.GetAllAsync();
        return MaterialDTOTranslator.ToDTOs(materials);
    }

    public async Task<MaterialDTO?> GetMaterialByIdAsync(int id)
    {
        var material = await _repository.GetByIdAsync(id);
        return material != null ? MaterialDTOTranslator.ToDTO(material) : null;
    }

    public async Task<MaterialDTO> CreateMaterialAsync(CreateMaterialDTO createDTO)
    {
        var material = MaterialDTOTranslator.ToEntity(createDTO);
        var created = await _repository.CreateAsync(material);
        return MaterialDTOTranslator.ToDTO(created);
    }

    public async Task<MaterialDTO> UpdateMaterialAsync(int id, UpdateMaterialDTO updateDTO)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            throw new KeyNotFoundException($"Material with id {id} not found");

        MaterialDTOTranslator.UpdateEntity(updateDTO, existing);
        var updated = await _repository.UpdateAsync(existing);
        return MaterialDTOTranslator.ToDTO(updated);
    }

    public async Task DeleteMaterialAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }
}