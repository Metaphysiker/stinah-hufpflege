using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Controllers;

[Authorize(Roles = "RegularUser")]
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
        var model = _fileDTOConverter.Convert(dto);
        await _db.AddAsync(model);
        await _db.SaveChangesAsync();
        var createdModel = await _db.Files.FindAsync(model.Id);
        if (createdModel == null)
        {
            return BadRequest();
        }
        return _fileDTOConverter.Convert(createdModel);
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
    public async Task<ActionResult<PaginationDTO<FileDTO>>> Search([FromBody] FileSearch search)
    {
        var query = _db.Files.AsQueryable();

        if (search.Ids.Count > 0)
        {
            query = query.Where(t => search.Ids.Contains(t.Id));
        }

        if (search.HorseId != null)
        {
            query = query.Where(t => t.Horse != null && t.Horse.Id == search.HorseId);
        }

        if (search.SortBy != null)
        {
            if (search.SortBy == "CreatedAt")
            {
                query = query.OrderBy(t => t.CreatedAt);
            }

            if (search.SortOrder != null && search.SortOrder == "descending")
            {
                query = query.Reverse();
            }
        }

        PaginationDTO<FileDTO> paginationDTO = new PaginationDTO<FileDTO>();
        paginationDTO.TotalItems = await query.CountAsync();

        var results = await query
            .Skip(search.Page * search.PageSize)
            .Take(search.PageSize)
            .ToListAsync();

        paginationDTO.TotalPages = (int)Math.Ceiling((double)paginationDTO.TotalItems / search.PageSize);
        paginationDTO.Page = search.Page;
        paginationDTO.Data = _fileDTOConverter.Convert(results);
        return paginationDTO;
    }
}
