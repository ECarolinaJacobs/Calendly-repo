public class RoomAlreadyBookedException : Exception
{
    public RoomAlreadyBookedException() : base("Room already booked")
    {}
}