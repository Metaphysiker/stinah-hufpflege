using Microsoft.AspNetCore.Mvc;

public interface IModelController<Dto, SearchT> where Dto : IDTO where SearchT : ISearch
{
    public Task<ActionResult<List<Dto>>> ReadAll();
    public Task<ActionResult<Dto>> Read(int id);
    public Task<ActionResult<Dto>> Create([FromBody] Dto dto);
    public Task<ActionResult<Dto>> Update([FromBody] Dto dto);
    public Task<ActionResult> Delete(int id);
    public Task<ActionResult<List<Dto>>> Search([FromBody] SearchT search);
}
