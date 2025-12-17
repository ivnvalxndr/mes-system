using materials_service.DTO;

namespace materials_service.Service.Interfaces;

public interface IUnitService
{
    Task<IEnumerable<UnitDTO>> GetAllUnitsAsync();
    Task<UnitDTO?> GetUnitByIdAsync(int id);
    Task<UnitDTO> CreateUnitAsync(CreateUnitDTO createDTO);
    Task<UnitDTO> UpdateUnitAsync(int id, UpdateUnitDTO updateDTO);
    Task DeleteUnitAsync(int id);
}