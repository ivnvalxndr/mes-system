// materials-service/Controllers/MaterialRouteStepsController.cs
using Microsoft.AspNetCore.Mvc;
using materials_service.DTO;
using materials_service.Services;
using materials_service.Entities.Enums;
using materials_service.Service.Interfaces;

namespace materials_service.Controllers;

[ApiController]
[Route("api/materials/{materialId}/[controller]")]
public class MaterialRouteStepsController : ControllerBase
{
    private readonly IMaterialRouteStepService _stepService;
    private readonly ILogger<MaterialRouteStepsController> _logger;

    public MaterialRouteStepsController(
        IMaterialRouteStepService stepService,
        ILogger<MaterialRouteStepsController> logger)
    {
        _stepService = stepService;
        _logger = logger;
    }

    // GET: api/materials/{materialId}/materialroutesteps
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MaterialRouteStepDTO>>> GetStepsByMaterialId(int materialId)
    {
        try
        {
            var steps = await _stepService.GetStepsByMaterialIdAsync(materialId);
            return Ok(steps);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting steps for material {MaterialId}", materialId);
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }

    // GET: api/materials/{materialId}/materialroutesteps/{stepId}
    [HttpGet("{stepId:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MaterialRouteStepDTO>> GetStepById(int materialId, int stepId)
    {
        try
        {
            var step = await _stepService.GetStepByIdAsync(stepId);
            if (step == null)
            {
                return NotFound(new { message = $"Route step with id {stepId} not found" });
            }

            if (step.MaterialId != materialId)
            {
                return BadRequest(new { message = $"Step {stepId} does not belong to material {materialId}" });
            }

            return Ok(step);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting step {StepId} for material {MaterialId}", stepId, materialId);
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }

    // POST: api/materials/{materialId}/materialroutesteps
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MaterialRouteStepDTO>> CreateStep(
        int materialId,
        [FromBody] CreateMaterialRouteStepDTO createDTO)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Валидация StepType (enum)
            if (!Enum.IsDefined(typeof(MaterialRouteStepType), createDTO.StepType))
            {
                return BadRequest(new
                {
                    message = "Invalid StepType value",
                    validValues = Enum.GetNames(typeof(MaterialRouteStepType))
                });
            }

            // Устанавливаем MaterialId из роута
            createDTO.MaterialId = materialId;

            var createdStep = await _stepService.CreateStepAsync(createDTO);

            return CreatedAtAction(
                nameof(GetStepById),
                new { materialId = materialId, stepId = createdStep.Id },
                createdStep);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating step for material {MaterialId}", materialId);
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }

    // PUT: api/materials/{materialId}/materialroutesteps/{stepId}
    [HttpPut("{stepId:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MaterialRouteStepDTO>> UpdateStep(
        int materialId,
        int stepId,
        [FromBody] MaterialRouteStepDTO updateDTO)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Валидация StepType (enum)
            if (!Enum.IsDefined(typeof(MaterialRouteStepType), updateDTO.StepType))
            {
                return BadRequest(new
                {
                    message = "Invalid StepType value",
                    validValues = Enum.GetNames(typeof(MaterialRouteStepType))
                });
            }

            // Проверяем, что stepId в пути совпадает с Id в DTO
            if (updateDTO.Id != 0 && updateDTO.Id != stepId)
            {
                return BadRequest(new { message = "StepId in URL does not match Id in request body" });
            }

            // Устанавливаем правильные ID
            updateDTO.Id = stepId;
            updateDTO.MaterialId = materialId;

            var updatedStep = await _stepService.UpdateStepAsync(stepId, updateDTO);
            return Ok(updatedStep);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating step {StepId} for material {MaterialId}", stepId, materialId);
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }

    // PATCH: api/materials/{materialId}/materialroutesteps/{stepId}
    [HttpPatch("{stepId:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MaterialRouteStepDTO>> PartialUpdateStep(
        int materialId,
        int stepId,
        [FromBody] Dictionary<string, object> patchData)
    {
        try
        {
            var existingStep = await _stepService.GetStepByIdAsync(stepId);
            if (existingStep == null)
            {
                return NotFound(new { message = $"Route step with id {stepId} not found" });
            }

            if (existingStep.MaterialId != materialId)
            {
                return BadRequest(new { message = $"Step {stepId} does not belong to material {materialId}" });
            }

            // Создаем DTO для обновления
            var updateDTO = new MaterialRouteStepDTO
            {
                Id = existingStep.Id,
                MaterialId = existingStep.MaterialId,
                StepType = existingStep.StepType,
                FromLocation = existingStep.FromLocation,
                ToLocation = existingStep.ToLocation,
                Quantity = existingStep.Quantity,
                UnitId = existingStep.UnitId,
                Notes = existingStep.Notes,
                CreatedAt = existingStep.CreatedAt
            };

            // Частичное обновление
            if (patchData.ContainsKey("stepType"))
            {
                if (Enum.TryParse<MaterialRouteStepType>(patchData["stepType"].ToString(), out var stepType))
                {
                    updateDTO.StepType = stepType;
                }
                else
                {
                    return BadRequest(new
                    {
                        message = "Invalid StepType value",
                        validValues = Enum.GetNames(typeof(MaterialRouteStepType))
                    });
                }
            }

            if (patchData.ContainsKey("fromLocation"))
                updateDTO.FromLocation = patchData["fromLocation"].ToString();

            if (patchData.ContainsKey("toLocation"))
                updateDTO.ToLocation = patchData["toLocation"].ToString();

            if (patchData.ContainsKey("quantity") && decimal.TryParse(patchData["quantity"].ToString(), out var quantity))
                updateDTO.Quantity = quantity;

            if (patchData.ContainsKey("unitId"))
                updateDTO.UnitId = patchData["unitId"].ToString();

            if (patchData.ContainsKey("notes"))
                updateDTO.Notes = patchData["notes"].ToString();

            var updatedStep = await _stepService.UpdateStepAsync(stepId, updateDTO);
            return Ok(updatedStep);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error partially updating step {StepId} for material {MaterialId}", stepId, materialId);
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }

    // DELETE: api/materials/{materialId}/materialroutesteps/{stepId}
    [HttpDelete("{stepId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteStep(int materialId, int stepId)
    {
        try
        {
            var step = await _stepService.GetStepByIdAsync(stepId);
            if (step == null)
            {
                return NotFound(new { message = $"Route step with id {stepId} not found" });
            }

            if (step.MaterialId != materialId)
            {
                return BadRequest(new { message = $"Step {stepId} does not belong to material {materialId}" });
            }

            await _stepService.DeleteStepAsync(stepId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting step {StepId} for material {MaterialId}", stepId, materialId);
            return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }
}