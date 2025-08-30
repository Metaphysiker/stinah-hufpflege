public class RoutineDTOConverter : IDtoConverter<Routine, RoutineDTO>
{

    private readonly AutoMapperService _mapperService;

    private readonly DatabaseContext _db;

    public RoutineDTOConverter(AutoMapperService mapperService, DatabaseContext db)
    {
        _mapperService = mapperService;
        _db = db;
    }

    public Routine Convert(RoutineDTO routineDTO)
    {
        Routine routine = _mapperService.mapper.Map<Routine>(routineDTO);
        Horse? horse = _db.Horses.Find(routine.HorseId);
        if (horse != null)
        {
            routine.Horse = horse;
            horse.Routines.Add(routine);
        }
        return routine;
    }

    public RoutineDTO Convert(Routine routine)
    {
        RoutineDTO routineDTO = _mapperService.mapper.Map<RoutineDTO>(routine);

        Horse? horse = _db.Horses.Find(routine.HorseId);
        if (horse != null)
        {
            routineDTO.HorseName = horse.Name;

            var lastRoutineOfHorseInSameCategory = _db.Routines
                .Where(t => t.HorseId == routine.HorseId && t.TreatmentCategoryName == routine.TreatmentCategoryName)
                .OrderByDescending(t => t.Date)
                .FirstOrDefault();
            if (lastRoutineOfHorseInSameCategory != null)
            {
                Console.WriteLine("Found last routine of horse in same category: " + lastRoutineOfHorseInSameCategory.Id);
            }
        }


        return routineDTO;
    }

    public List<RoutineDTO> Convert(List<Routine> routines)
    {
        List<RoutineDTO> routineDTOs = new List<RoutineDTO>();
        foreach (Routine routine in routines)
        {
            routineDTOs.Add(Convert(routine));
        }
        return routineDTOs;
    }

    public List<Routine> Convert(List<RoutineDTO> routineDTOs)
    {
        List<Routine> routines = new List<Routine>();
        foreach (RoutineDTO routineDTO in routineDTOs)
        {
            routines.Add(Convert(routineDTO));
        }
        return routines;
    }
}
