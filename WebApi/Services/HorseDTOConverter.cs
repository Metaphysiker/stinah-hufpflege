public class HorseDTOConverter : IDtoConverter<Horse, HorseDTO>
{

    private readonly HoofCheckHelper _hoofCheckHelper = new HoofCheckHelper();
    private readonly AutoMapperService _mapperService;
    public HorseDTOConverter(AutoMapperService mapperService)
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
        horseDTO.FileIds = horse.Files.Select(f => f.Id).ToList();
        horseDTO.TreatmentDates = GetLastTimeTreatedForEachCategory(horse);
        horseDTO.SummaryHoofCheckStatusOfLastTreatment = _hoofCheckHelper.GetSummaryHoofCheckStatusOfLastTreatment(horse);
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

    public List<TreatmentDate> GetLastTimeTreatedForEachCategory(Horse horse)
    {
        List<TreatmentDate> treatmentDates = new List<TreatmentDate>();
        var categories = horse.Treatments.Select(t => t.Category).Distinct();
        foreach (var category in categories)
        {
            TreatmentDate treatmentDate = new TreatmentDate();
            treatmentDate.Category = category;
            if (horse.Treatments.Where(t => t.Category == category).Count() > 0)
            {
                treatmentDate.LastTimeTreated = horse.Treatments.Where(t => t.Category == category).Max(t => t.Date);
                treatmentDates.Add(treatmentDate);
            }

        }
        return treatmentDates;
    }
}
