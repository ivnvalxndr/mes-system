// materials-service/Controllers/MaterialsController.cs
using Microsoft.AspNetCore.Mvc;
using materials_service.DTO;
using materials_service.Services;
using materials_service.Service.Interfaces;

namespace materials_service.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaterialsController : ControllerBase
{
    private readonly IMaterialsService _materialsService;
    private readonly ILogger<MaterialsController> _logger;

    public MaterialsController(
        IMaterialsService materialsService,
        ILogger<MaterialsController> logger)
    {
        _materialsService = materialsService;
        _logger = logger;
    }

    // GET: api/materials
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MaterialDTO>>> GetAll()
    {
        try
        {
            var materials = await _materialsService.GetAllMaterialsAsync();
            return Ok(materials);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all materials");
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }

    // GET: api/materials/{id}
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MaterialDTO>> GetById(int id)
    {
        try
        {
            var material = await _materialsService.GetMaterialByIdAsync(id);
            if (material == null)
            {
                return NotFound(new { message = $"Material with id {id} not found" });
            }
            return Ok(material);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting material by id {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }

    // POST: api/materials
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MaterialDTO>> Create([FromBody] CreateMaterialDTO createDTO)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var material = await _materialsService.CreateMaterialAsync(createDTO);

            return CreatedAtAction(
                nameof(GetById),
                new { id = material.Id },
                material);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating material");
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }

    // PUT: api/materials/{id}
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MaterialDTO>> Update(int id, [FromBody] UpdateMaterialDTO updateDTO)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var material = await _materialsService.UpdateMaterialAsync(id, updateDTO);
            return Ok(material);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating material {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }

    // DELETE: api/materials/{id}
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _materialsService.DeleteMaterialAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting material {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }
}