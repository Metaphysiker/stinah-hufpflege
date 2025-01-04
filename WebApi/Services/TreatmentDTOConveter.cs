public class TreatmentDTOConverter
{

    private readonly AutoMapperService _mapperService;

    public TreatmentDTOConverter(AutoMapperService mapperService)
    {
        _mapperService = mapperService;
    }

    public Treatment Convert(TreatmentDTO treatmentDTO)
    {
        Treatment treatment = _mapperService.mapper.Map<Treatment>(treatmentDTO);
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
