using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using materials_service.Data;
using materials_service.Entities;
using units_service.Entities;

namespace materials_service.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnitsController : ControllerBase
{
    private readonly MaterialDbContext _context;
    private readonly ILogger<UnitsController> _logger;

    public UnitsController(
        MaterialDbContext context,
        ILogger<UnitsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/units
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Unit>>> GetAll()
    {
        try
        {
            var units = await _context.Units.ToListAsync();
            return Ok(units);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all units");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/units/{id}
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Unit>> GetById(int id)
    {
        try
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null)
            {
                return NotFound($"Unit with id {id} not found");
            }
            return Ok(unit);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unit by id {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // POST: api/units
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Unit>> Create([FromBody] Unit unit)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Units.Add(unit);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = unit.Id },
                unit);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating unit");
            return StatusCode(500, "Internal server error");
        }
    }
}