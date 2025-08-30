using AutoMapper;

public class AutoMapperService
{

    public IMapper mapper { get; set; }

    public AutoMapperService()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<Horse, HorseDTO>().ReverseMap();
            cfg.CreateMap<Treatment, TreatmentDTO>().ReverseMap();
            cfg.CreateMap<File, FileDTO>().ReverseMap();
            cfg.CreateMap<Routine, RoutineDTO>().ReverseMap();
        }
        );

        mapper = new Mapper(config);
    }
}
