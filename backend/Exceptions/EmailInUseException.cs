public class EmailInUseException : Exception
{
    public EmailInUseException() : base("Email already in use")
    {}
}