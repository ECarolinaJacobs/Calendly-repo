public class MissingFieldsException : Exception
{
    public MissingFieldsException(string fieldName) : base($"Missing required fields: {fieldName}")
    {}
}