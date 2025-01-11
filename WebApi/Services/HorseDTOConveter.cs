public class HorseDTOConveter : IDtoConverter<Horse, HorseDTO>
{

    private readonly AutoMapperService _mapperService;
    public HorseDTOConveter(AutoMapperService mapperService)
    {
        _mapperService = mapperService;
    }

    public Horse Convert(HorseDTO horseDTO)
    {
        Horse horse = _mapperService.mapper.Map<Horse>(horseDTO);

        return horse;
    }

    public HorseDTO Convert(Horse horse)
    {
        HorseDTO horseDTO = _mapperService.mapper.Map<HorseDTO>(horse);
        horseDTO.TreatmentIds = horse.Treatments.Select(t => t.Id).ToList();
        return horseDTO;
    }

    public List<HorseDTO> Convert(List<Horse> horses)
    {
        List<HorseDTO> horseDTOs = new List<HorseDTO>();
        foreach (Horse horse in horses)
        {
            horseDTOs.Add(Convert(horse));
        }
        return horseDTOs;
    }

    public List<Horse> Convert(List<HorseDTO> horseDTOs)
    {
        List<Horse> horses = new List<Horse>();
        foreach (HorseDTO horseDTO in horseDTOs)
        {
            horses.Add(Convert(horseDTO));
        }
        return horses;
    }
}
