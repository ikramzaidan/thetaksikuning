import { useState } from "react";
import { FaClock } from "react-icons/fa6";
import Map from "./Map";

const Row = ({ data, index, tripActive, setTripActive }) => {

    const [trip, setTrip] = useState();

    const handleShowTrip = (id, data) => {
        if (tripActive !== id) {
            setTripActive(id);
            setTrip(data);
        } else {
            setTripActive(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (


        <div key={index}>
            <div className="flex flex-row gap-3 border-x border-b p-3 cursor-pointer text-center" onClick={() => handleShowTrip(index, data)}>
                <div className="basis-1/12">{index + 1}</div>
                <div className="basis-2/12">{data.vendor_id}</div>
                <div className="basis-3/12">{parseFloat(data.trip_distance).toFixed(2)} mil</div>
                <div className="basis-4/12">{formatDate(data.pickup_datetime)}</div>
                <div className="basis-2/12">{data.payment_type}</div>
            </div>
            {tripActive === index &&
                <div className="flex lg:min-h-80 bg-gray-50 border-x border-b px-5 lg:px-10 xl:px-20 py-5 shadow-inner">
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 w-full">
                        <div className="flex flex-col">
                            <div className="flex flex-col mb-3">
                                <div className="text-4xl font-bold">${data.fare_amount} <span className="text-base font-normal">({parseFloat(data.trip_distance).toFixed(2)} mil)</span></div>
                                <div className="text-sm font-light">${data.mta_tax} (Tax)</div>
                                <div className="text-sm font-light">${data.imp_surcharge} (Charge)</div>
                                <div className="text-sm font-light">${data.total_amount} (Total Amount)</div>
                            </div>
                            <div className="flex gap-3 datas-center">
                                <FaClock className="text-green-500" />
                                {formatDate(data.pickup_datetime)}
                            </div>
                            <div className="flex gap-3 datas-center">
                                <FaClock className="text-red-500" />
                                {formatDate(data.dropoff_datetime)}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-full h-full min-h-64">
                                <Map data={trip} />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Row;