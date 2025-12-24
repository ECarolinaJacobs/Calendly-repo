public class ResourceDoesNotExistException : Exception
{
    public string Resource { get; }
    public ResourceDoesNotExistException(string resource) : base($"{resource} does not exist")
    {
        Resource = resource;
    }
}