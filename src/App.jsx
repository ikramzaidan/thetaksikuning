import "../src/App.css"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import FilterModal from "./components/FilterModal";
import { FaBars, FaClock, FaFilter, FaTaxi, FaUser } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Row from "./components/Row";

function App() {
  const [trips, setTrips] = useState([]);
  const [tripActive, setTripActive] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(false);

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
      <Sidebar isSidebarActive={isSidebarActive} setIsSidebarActive={setIsSidebarActive} />
      <div className={`${isSidebarActive ? ("blur") : ("")} flex flex-col gap-5 w-full max-h-screen p-5 lg:p-10`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarActive(true)} className="flex lg:hidden border rounded shadow p-2"><FaBars/></button>
            <h2 className="text-2xl font-bold">Trips</h2>
          </div>
          <button onClick={() => setIsFilterVisible(true)} className=" flex items-center gap-2 bg-white border rounded-sm shadow text-sm font-medium px-5 py-2"><FaFilter />Filters</button>
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
          >
            {trips.map((item, index) => (
              <Row data={item} index={index} tripActive={tripActive} setTripActive={setTripActive} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}

export default App
