import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import RoutingMachine from './Routing';

const SetView = ({ center }) => {
    const map = useMap();
    map.flyTo(center, map.getZoom())
    return null;
}

const Map = ({ data }) => {
    
    return(
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RoutingMachine pickup={[data.pickup_latitude, data.pickup_longitude]} dropoff={[data.dropoff_latitude, data.dropoff_longitude]} />
            {data && 
                <SetView
                    center={[
                        data.pickup_latitude,
                        data.pickup_longitude,
                    ]}
                />
            }
        </MapContainer>
    )
}

export default Map;