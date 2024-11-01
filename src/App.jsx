import "../src/App.css"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Map from "./components/Map";
import FilterModal from "./components/FilterModal";
import { FaClock, FaFilter, FaTaxi, FaUser } from "react-icons/fa6";

function App() {
  const [trips, setTrips] = useState([]);
  const [trip, setTrip] = useState();
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;
  const [tripActive, setTripActive] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Filter states
  const [pickupFilter, setPickupFilter] = useState("");
  const [dropoffFilter, setDropoffFilter] = useState("");
  const [fareFilter, setFareFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const endpoint = "https://data.cityofnewyork.us/resource/gkne-dk5s.json";
  const token = "NWRBSpEKRx9pwpcSSzJecUuQu";

  const fetchData = (page) => {
    let url = `${endpoint}?$$app_token=${token}&$limit=${itemsPerPage}&$offset=${(page - 1) * itemsPerPage}`;

    const conditions = [];

    if (pickupFilter) conditions.push(`pickup_datetime ${pickupFilter}`);
    if (dropoffFilter) conditions.push(`dropoff_datetime ${dropoffFilter}`);
    if (fareFilter) conditions.push(`fare_amount ${fareFilter}`);
    if (distanceFilter) conditions.push(`trip_distance ${distanceFilter}`);
    
    if (conditions.length > 0) {
        url += `&$where=${conditions.join(' AND ')}`;
    }

    if (paymentFilter) url += `&payment_type=${paymentFilter}`;

    setTimeout(() => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setTrips((prev) => [...prev, ...data]);
        })
        .catch(err => {
          console.log(err);
        });
    }, 500);
  }

  useEffect(() => {
    setTrips([]);
    fetchData(1);
  }, [pickupFilter, dropoffFilter, fareFilter, distanceFilter, paymentFilter]);

  const loadMoreData = () => {
    setPage(prevPage => prevPage + 1);
    fetchData(page + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    return date.toLocaleString('en-US', {
        weekday: 'long',       // Thursday
        year: 'numeric',       // 2011
        month: 'long',         // March
        day: 'numeric',        // 9
        hour: 'numeric',       // 08
        minute: 'numeric',     // 57
        hour12: true           // PM
    });
};

  const handleShowTrip = (id, data) => {
    if (tripActive !== id) {
        setTripActive(id);
        setTrip(data);
    } else {
        setTripActive(null);
    } 
  };

  return (
    <div className="flex flex-1 min-h-screen bg-white">
      {isFilterVisible &&
        <div className="fixed w-full h-full bg-black bg-opacity-50 z-50 px-3 md:px-0 py-10">
          <FilterModal 
            setIsFilterVisible={setIsFilterVisible}
            setPickupFilter={setPickupFilter}
            setDropoffFilter={setDropoffFilter}
            setFareFilter={setFareFilter}
            setDistanceFilter={setDistanceFilter} 
            setPaymentFilter={setPaymentFilter} 
          />
        </div>
      }
      <div className="hidden lg:flex w-80 h-auto border-r">
        <div className="flex flex-col gap-5 p-5">
          <div id="navbar-brand" className="cursor-pointer">
            <img src="../nyc-tlc-logo.svg" alt="logo" />
          </div>
          <ul className="flex flex-col gap-2 font-semibold">
            <li className="flex items-center gap-3 bg-gray-200 rounded px-5 py-2"><FaTaxi className="text-sm" />Trips</li>
            <li className="flex items-center gap-3 hover:bg-gray-200 rounded px-5 py-2"><FaUser className="text-sm" />Users</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-5 w-full max-h-screen p-5 lg:p-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Trips</h2>
          <button onClick={() => setIsFilterVisible(true)} className=" flex items-center gap-2 bg-white border rounded-sm shadow-md text-sm font-medium px-5 py-2"><FaFilter />Filters</button>
        </div>
        <div id="scrollableDiv" className="flex flex-col w-full h-full overflow-auto">
          <div className="flex flex-row gap-3 border p-3 font-bold text-center">
            <div className="basis-1/12">No</div>
            <div className="basis-2/12">Vendor</div>
            <div className="basis-3/12">Distance</div>
            <div className="basis-4/12">Pickup</div>
            <div className="basis-2/12">Payment</div>
          </div>
          <InfiniteScroll
            dataLength={trips.length}
            next={loadMoreData}
            hasMore={trips.length < 2000}
            loader={
              <div className="flex flex-1 border-x border-b p-3 font-bold justify-center">Loading...</div>
            }
            scrollableTarget="scrollableDiv"
          >
            {trips.map((item, index) => (
              <div key={index}>
                <div className="flex flex-row gap-3 border-x border-b p-3 cursor-pointer text-center" onClick={() => handleShowTrip(index, item)}>
                  <div className="basis-1/12">{index + 1}</div>
                  <div className="basis-2/12">{item.vendor_id}</div>
                  <div className="basis-3/12">{parseFloat(item.trip_distance).toFixed(2)} mil</div>
                  <div className="basis-4/12">{formatDate(item.pickup_datetime)}</div>
                  <div className="basis-2/12">{item.payment_type}</div>
                </div>
                {tripActive === index &&
                  <div className="flex lg:min-h-80 bg-gray-50 border-x border-b px-20 py-5 shadow-inner">
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 w-full">
                      <div className="flex flex-col">
                        <div className="flex flex-col mb-3">
                          <div className="text-4xl font-bold">${item.fare_amount} <span className="text-base font-normal">({parseFloat(item.trip_distance).toFixed(2)} mil)</span></div>
                          <div className="text-sm font-light">${item.mta_tax} (Tax)</div>
                          <div className="text-sm font-light">${item.imp_surcharge} (Charge)</div>
                          <div className="text-sm font-light">${item.total_amount} (Total Amount)</div>
                        </div>
                        <div className="flex gap-3 items-center">
                          <FaClock className="text-green-500" />
                          {formatDate(item.pickup_datetime)}
                        </div>
                        <div className="flex gap-3 items-center">
                          <FaClock className="text-red-500" />
                          {formatDate(item.dropoff_datetime)}
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
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}

export default App
