public class FileDTOConverter : IDtoConverter<File, FileDTO>
{
    private readonly AutoMapperService _mapperService;
    public FileDTOConverter(AutoMapperService mapperService)
    {
        _mapperService = mapperService;
    }

    public File Convert(FileDTO FileDTO)
    {
        File file = _mapperService.mapper.Map<File>(FileDTO);

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
