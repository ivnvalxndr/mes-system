using Microsoft.AspNetCore.Mvc;
using materials_service.DTO;
using materials_service.Service.Interfaces;

namespace materials_service.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaterialController : ControllerBase
{
    private readonly IMaterialsService _materialsService;

    public MaterialController(IMaterialsService materialsService)
    {
        _materialsService = materialsService;
    }

    // GET: api/materials
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MaterialDTO>>> GetMaterials()
    {
        var materials = await _materialsService.GetAllMaterialsAsync();
        return Ok(materials);
    }

    // GET: api/materials/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<MaterialDTO>> GetMaterial(int id)
    {
        var material = await _materialsService.GetMaterialByIdAsync(id);
        if (material == null)
        {
            return NotFound();
        }
        return Ok(material);
    }

    // POST: api/materials
    [HttpPost]
    public async Task<ActionResult<MaterialDTO>> CreateMaterial(CreateMaterialDTO createDto)
    {
        try
        {
            var material = await _materialsService.CreateMaterialAsync(createDto);
            return CreatedAtAction(nameof(GetMaterial), new { id = material.Id }, material);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // PUT: api/materials/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMaterial(int id, UpdateMaterialDTO updateDto)
    {
        try
        {
            await _materialsService.UpdateMaterialAsync(id, updateDto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE: api/materials/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMaterial(int id)
    {
        try
        {
            await _materialsService.DeleteMaterialAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // GET: api/materials/search?code={code}
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<MaterialSimpleDTO>>> SearchMaterials(
        [FromQuery] string? code = null,
        [FromQuery] string? name = null)
    {
        var materials = await _materialsService.SearchMaterialsAsync(code, name);
        return Ok(materials);
    }
}