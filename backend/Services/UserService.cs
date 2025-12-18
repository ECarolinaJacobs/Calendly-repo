namespace TodoApi.Context;


public class UserService
{
    private readonly ProjectContext _context;

    public UserService(ProjectContext context)
    {
        _context = context;
    }

}