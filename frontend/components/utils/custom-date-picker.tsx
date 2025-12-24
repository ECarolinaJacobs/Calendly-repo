import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const CustomDatePicker = ({
	selected,
	onChange,
	label,
	placeholder,
}) => {
	return (
		<div className="">
			<label
				htmlFor={label}
				className="block text-sm font-medium text-gray-700 mb-2"
			>
				{label}
			</label>
			<DatePicker
				selected={selected}
				onChange={(date) => onChange(date)}
				dateFormat="dd-MM-yyyy HH:mm"
				timeFormat="HH:mm"
				showTimeSelect
				showIcon
				showDateSelect
				timeIntervals={15}
				className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
				placeholderText={placeholder}
			/>
		</div>
	);
};
