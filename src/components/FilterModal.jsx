import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const FilterModal = ({
    setIsFilterVisible,
    setPickupFilter,
    setDropoffFilter,
    setFareFilter,
    setPaymentFilter,
    setDistanceFilter
}) => {

    const [filter, setFilter] = useState({
        pickup_datetime_operator: ">",
        dropoff_datetime_operator: ">",
        fare_amount_operator: ">",
        trip_distance_operator: ">"
    });

    const convertToFormattedDateTime = (date) => {
        return `${date}T00:00:00`;
    }

    const handleFilterChange = () => (event) => {
        const { name, value } = event.target;
        let formattedValue = value;

        if (event.target.type === "date") {
            formattedValue = convertToFormattedDateTime(value);
        }

        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: value,
        }));
    }

    const handleFilterApply = (event) => {
        event.preventDefault();

        if (filter.pickup_datetime && filter.pickup_datetime_operator) {
            setPickupFilter(` ${filter.pickup_datetime_operator} '${filter.pickup_datetime}'`)
        }
        if (filter.dropoff_datetime && filter.dropoff_datetime_operator) {
            setDropoffFilter(` ${filter.dropoff_datetime_operator} '${filter.dropoff_datetime}'`)
        }
        if(filter.fare_amount && filter.fare_amount_operator) {
            setFareFilter(` ${filter.fare_amount_operator} ${filter.fare_amount}`)
        }
        if(filter.trip_distance && filter.trip_distance_operator) {
            setDistanceFilter(` ${filter.trip_distance_operator} ${filter.trip_distance}`)
        }
        if(filter.payment_type !== undefined) setPaymentFilter(filter.payment_type);

        setIsFilterVisible(false);
    }

    useEffect(() => {
        console.log(filter);
    }, [filter])

    return(
        <div className="flex flex-col relative w-full md:w-[32rem] bg-white rounded shadow-md inset-x-0 mx-auto">
            <div className="flex justify-between items-center bg-gray-100 border-b rounded-t p-3">
                <div className="text-sm font-semibold">Filter</div>
                <button onClick={() => setIsFilterVisible(false)}><FaTimes/></button>
            </div>
            <div className="flex flex-col gap-5 text-sm p-3">
                {/* Pickup filter */}
                <div className="flex flex-col">
                    <div className="text-gray-500 mb-2">Select pickup date:</div>
                    <div className="grid grid-cols-3 gap-3">
                        <select name="pickup_datetime_operator" className="w-full border rounded shadow-sm p-2" onChange={handleFilterChange()}>
                            <option value=">">After</option>
                            <option value="<">Before</option>
                        </select>
                        <input name="pickup_datetime" type="date" className="col-span-2 w-full border rounded shadow-sm p-2" onChange={handleFilterChange()}></input>
                    </div>
                </div>
                {/* Dropoff filter */}
                <div className="flex flex-col">
                <div className="text-gray-500 mb-2">Select dropoff date:</div>
                    <div className="grid grid-cols-3 gap-3">
                        <select name="dropoff_datetime_operator" className="w-full border rounded shadow-sm p-2" onChange={handleFilterChange()}>
                            <option value=">">After</option>
                            <option value="<">Before</option>
                        </select>
                        <input name="dropoff_datetime" type="date" className="col-span-2 w-full border rounded shadow-sm p-2" onChange={handleFilterChange()}></input>
                    </div>
                </div>
                {/* Fare filter */}
                <div className="flex flex-col">
                    <div className="text-gray-500 mb-2">Fare Amount:</div>
                    <div className="grid grid-cols-3 gap-3">
                        <select name="fare_amount_operator" className="w-full border rounded shadow-sm p-2" onChange={handleFilterChange()}>
                            <option value=">">More than</option>
                            <option value="<">Less than</option>
                            <option value="=">Equal than</option>
                        </select>
                        <input name="fare_amount" type="number" className="col-span-2 w-full border rounded shadow-sm p-2" onChange={handleFilterChange()} placeholder="(miles)"></input>
                    </div>
                </div>
                {/* Distance filter */}
                <div className="flex flex-col">
                    <div className="text-gray-500 mb-2">Distance:</div>
                    <div className="grid grid-cols-3 gap-3">
                        <select name="trip_distance_operator" className="w-full border rounded shadow-sm p-2" onChange={handleFilterChange()}>
                            <option value=">">More than</option>
                            <option value="<">Less than</option>
                            <option value="=">Equal than</option>
                        </select>
                        <input name="trip_distance" type="number" className="col-span-2 w-full border rounded shadow-sm p-2" onChange={handleFilterChange()} placeholder="(miles)"></input>
                    </div>
                </div>
                {/* Payment filter */}
                <div className="flex flex-col">
                    <div className="text-gray-500 mb-2">Payment type:</div>
                    <select name="payment_type" value={filter.payment_type} className="w-full border rounded shadow-sm p-2" onChange={handleFilterChange()}>
                        <option value="">All</option>
                        <option value="CRD">Credit Card</option>
                        <option value="CSH">Cash</option>
                        <option value="UNK">Unknown</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-between items-center border-t rounded-b p-3 mt-3">
                <div className="border rounded px-3 text-sm py-2">Reset</div>
                <button type="button" onClick={handleFilterApply} className="bg-gray-200 rounded text-sm px-3 py-2">Apply</button>
            </div>
        </div>
    );
}

export default FilterModal;