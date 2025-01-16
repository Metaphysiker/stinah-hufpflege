using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Controllers;

[Authorize(Roles = "Admin, Stinah")]
[ApiController]
[Route("api/[controller]")]
public class FilesController : ControllerBase, IModelController<FileDTO, FileSearch>
{
    private readonly DatabaseContext _db;
    private readonly FileDTOConverter _fileDTOConverter;

    public FilesController(DatabaseContext db, FileDTOConverter fileDTOConverter)
    {
        _db = db;
        _fileDTOConverter = fileDTOConverter;
    }

    [HttpGet]
    public async Task<ActionResult<List<FileDTO>>> ReadAll()
    {
        var files = await _db.Files.ToListAsync();
        return _fileDTOConverter.Convert(files);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FileDTO>> Read(int id)
    {
        var file = await _db.Files.FindAsync(id);
        if (file == null)
        {
            return NotFound();
        }

        return _fileDTOConverter.Convert(file);
    }

    [HttpPost]
    public async Task<ActionResult<FileDTO>> Create([FromBody] FileDTO dto)
    {
        await _db.AddAsync(dto);
        _db.SaveChanges();
        var createdFile = await _db.Files.FindAsync(dto.Id);
        if (createdFile == null)
        {
            return BadRequest();
        }
        return _fileDTOConverter.Convert(createdFile);
    }

    [HttpPut]
    public async Task<ActionResult<FileDTO>> Update([FromBody] FileDTO dto)
    {
        var file = _fileDTOConverter.Convert(dto);
        _db.Update(file);
        await _db.SaveChangesAsync();
        var updatedFile = await _db.Files.FindAsync(file.Id);
        if (updatedFile == null)
        {
            return BadRequest();
        }
        return _fileDTOConverter.Convert(updatedFile);
    }

    [HttpDelete("{id}")]

    public async Task<ActionResult> Delete(int id)
    {
        var file = await _db.Files.FindAsync(id);
        if (file == null)
        {
            return NotFound();
        }

        _db.Remove(file);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("search")]
    public async Task<ActionResult<List<FileDTO>>> Search([FromBody] FileSearch search)
    {
        var query = _db.Files.AsQueryable();

        if (search.Ids.Count > 0)
        {
            query = query.Where(t => search.Ids.Contains(t.Id));
        }

        var results = await query
            .Skip(search.Page * search.PageSize)
            .Take(search.PageSize)
            .ToListAsync();

        return _fileDTOConverter.Convert(results);
    }
}
