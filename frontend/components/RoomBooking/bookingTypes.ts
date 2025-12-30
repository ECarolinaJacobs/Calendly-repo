export interface Room {
    id: number,
    name: string,
    floor: string,
    location: string,
    description: string
}

export interface RoomProp {
    room: Room
    startIso: string,
    endIso: string
}

export interface BookingModalProp {
    setOpenModal: (open: boolean) => void,
    room: Room
    startIso: string,
    endIso: string
}

export interface RoomFilteringProp {
    setRooms: any,
    setStartIso: any,
    setEndIso: any,
    setErrorMessage: any
}

export interface floorFilterProp {
    value: string,
    onChange: React.Dispatch<React.SetStateAction<string>>
}

export interface DateTimeFilter {
  selectedDate: string;
  selectedStarttime: string;
  selectedEndtime: string;
};

export interface DateTimeValueChanger {
    value: DateTimeFilter,
    onChange: React.Dispatch<React.SetStateAction<DateTimeFilter>>
}