using materials_service.DTO;
using materials_service.DTOTranslators;
using materials_service.Repositories.Interfaces;
using materials_service.Service.Interfaces;

namespace materials_service.Services;

public class MaterialRouteStepService : IMaterialRouteStepService
{
    private readonly IMaterialRouteStepRepository _repository;

    public MaterialRouteStepService(IMaterialRouteStepRepository repository)
    {
        _repository = repository;
    }

    public async Task<MaterialRouteStepDTO> CreateStepAsync(CreateMaterialRouteStepDTO createDTO)
    {
        var step = MaterialRouteStepDTOTranslator.ToEntity(createDTO);
        var created = await _repository.CreateAsync(step);
        return MaterialRouteStepDTOTranslator.ToDTO(created);
    }

    public async Task<IEnumerable<MaterialRouteStepDTO>> GetStepsByMaterialIdAsync(int materialId)
    {
        var steps = await _repository.GetByMaterialIdAsync(materialId);
        return MaterialRouteStepDTOTranslator.ToDTOs(steps);
    }

    public async Task<MaterialRouteStepDTO?> GetStepByIdAsync(int stepId)
    {
        var step = await _repository.GetByIdAsync(stepId);
        return step != null ? MaterialRouteStepDTOTranslator.ToDTO(step) : null;
    }

    public async Task<MaterialRouteStepDTO> UpdateStepAsync(int stepId, UpdateMaterialRouteStepDTO updateDTO)
    {
        var existing = await _repository.GetByIdAsync(stepId);
        if (existing == null)
            throw new KeyNotFoundException($"Route step with id {stepId} not found");

        // Преобразуем UpdateDTO в сущность
        MaterialRouteStepDTOTranslator.UpdateEntity(updateDTO, existing);

        // Сохраняем изменения
        var updated = await _repository.UpdateAsync(existing);

        // Возвращаем полный DTO
        return MaterialRouteStepDTOTranslator.ToDTO(updated);
    }

    public async Task DeleteStepAsync(int stepId)
    {
        await _repository.DeleteAsync(stepId);
    }

    public async Task<bool> StepExistsAsync(int stepId)
    {
        return await _repository.ExistsAsync(stepId);
    }
}