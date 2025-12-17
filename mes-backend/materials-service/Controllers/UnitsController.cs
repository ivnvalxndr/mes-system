using Microsoft.AspNetCore.Mvc;
using materials_service.DTO;
using materials_service.Service.Interfaces;

namespace materials_service.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnitController : ControllerBase
{
    private readonly IUnitService _unitService;

    public UnitController(IUnitService unitService)
    {
        _unitService = unitService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UnitDTO>>> GetUnits()
    {
        var units = await _unitService.GetAllUnitsAsync();
        return Ok(units);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UnitDTO>> GetUnit(int id)
    {
        var unit = await _unitService.GetUnitByIdAsync(id);
        if (unit == null)
            return NotFound();
        return Ok(unit);
    }

    [HttpPost]
    public async Task<ActionResult<UnitDTO>> CreateUnit(CreateUnitDTO createDto)
    {
        var unit = await _unitService.CreateUnitAsync(createDto);
        return CreatedAtAction(nameof(GetUnit), new { id = unit.Id }, unit);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUnit(int id, UpdateUnitDTO updateDto)
    {
        try
        {
            await _unitService.UpdateUnitAsync(id, updateDto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUnit(int id)
    {
        try
        {
            await _unitService.DeleteUnitAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}