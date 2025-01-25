public class FileDTOConverter : IDtoConverter<File, FileDTO>
{
    private readonly DatabaseContext _db;
    private readonly AutoMapperService _mapperService;
    public FileDTOConverter(AutoMapperService mapperService, DatabaseContext db)
    {
        _mapperService = mapperService;
        _db = db;
    }

    public File Convert(FileDTO FileDTO)
    {
        File file = _mapperService.mapper.Map<File>(FileDTO);

        Horse? horse = _db.Horses.Find(file.HorseId);
        if (horse != null)
        {
            file.Horse = horse;
            horse.Files.Add(file);
        }
        return file;
    }

    public FileDTO Convert(File file)
    {
        FileDTO fileDTO = _mapperService.mapper.Map<FileDTO>(file);
        fileDTO.Name = file.FileKeysString;
        return fileDTO;
    }

    public List<FileDTO> Convert(List<File> files)
    {
        List<FileDTO> FileDTOs = new List<FileDTO>();
        foreach (File file in files)
        {
            FileDTOs.Add(Convert(file));
        }
        return FileDTOs;
    }

    public List<File> Convert(List<FileDTO> FileDTOs)
    {
        List<File> files = new List<File>();
        foreach (FileDTO FileDTO in FileDTOs)
        {
            files.Add(Convert(FileDTO));
        }
        return files;
    }
}
