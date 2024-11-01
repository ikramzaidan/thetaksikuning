import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

const createRoutineMachineLayer = ({pickup, dropoff}) => {
    const instance = L.Routing.control({
        position: 'topright',
        waypoints: [
            L.latLng(pickup),
            L.latLng(dropoff)
        ],
        lineOptions: {
            styles: [
                {
                    color: '#757de8',
                },
            ],
        },
        show: false
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;