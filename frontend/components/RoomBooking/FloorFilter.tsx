import { floors } from "../../src/constants/booking";
import type { floorFilterProp } from "./bookingTypes";

const FloorFilter = ({ value, onChange } : floorFilterProp) => {

    return (
        <div>
            <select className="floor-select" value={value} onChange={(e : any) => onChange(e.target.value)}>
                <option>Select floor</option>
                {floors.map((floor : any) => (
                    <option key={floor} value={floor}>{floor}</option>
                ))}
            </select>
        </div>
    )
}

export default FloorFilter;