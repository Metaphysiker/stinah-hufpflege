public class TreatmentDTOConverter : IDtoConverter<Treatment, TreatmentDTO>
{

    private readonly AutoMapperService _mapperService;

    private readonly DatabaseContext _db;

    public TreatmentDTOConverter(AutoMapperService mapperService, DatabaseContext db)
    {
        _mapperService = mapperService;
        _db = db;
    }

    public Treatment Convert(TreatmentDTO treatmentDTO)
    {
        Treatment treatment = _mapperService.mapper.Map<Treatment>(treatmentDTO);

        Horse? horse = _db.Horses.Find(treatment.HorseId);
        if (horse != null)
        {
            treatment.Horse = horse;
            horse.Treatments.Add(treatment);
        }

        return treatment;
    }

    public TreatmentDTO Convert(Treatment treatment)
    {
        TreatmentDTO treatmentDTO = _mapperService.mapper.Map<TreatmentDTO>(treatment);
        return treatmentDTO;
    }

    public List<TreatmentDTO> Convert(List<Treatment> treatments)
    {
        List<TreatmentDTO> treatmentDTOs = new List<TreatmentDTO>();
        foreach (Treatment treatment in treatments)
        {
            treatmentDTOs.Add(Convert(treatment));
        }
        return treatmentDTOs;
    }

    public List<Treatment> Convert(List<TreatmentDTO> treatmentDTOs)
    {
        List<Treatment> treatments = new List<Treatment>();
        foreach (TreatmentDTO treatmentDTO in treatmentDTOs)
        {
            treatments.Add(Convert(treatmentDTO));
        }
        return treatments;
    }
}
