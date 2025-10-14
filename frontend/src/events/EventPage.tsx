import { useParams } from "react-router-dom";
import EventBox from "../../components/EventBox"

export default function EventPage() {
    const slug = useParams();


return (
    <div className="">
        <EventBox/>
    </div>
);
}
