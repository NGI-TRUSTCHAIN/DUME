'use client'

import {MapContainer, Marker, Polygon, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {useState} from 'react'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'
import { LatLngTuple } from 'leaflet';

const polygon: LatLngTuple[] = [
    [51.515, -0.09],
    [51.52, -0.1],
    [51.52, -0.12],
];

const Map = () => {

    const [coord, setCoord] = useState([51.505, -0.09])
    const position = [51.505, -0.09]
    const SearchLocation = () => {
        return (
            <div className="search-location">
                <input type="text" placeholder="Search Location"/>
            </div>
        )
    }
    
    const GetMyLocation = () => {
        const getMyLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setCoord([position.coords.latitude, position.coords.longitude])
                })
            } else {
                console.log("Geolocation is not supported by this browser.")
            }
        }

        return (
            <div className="get-my-location">
                <button onClick={getMyLocation}>Get My Location</button>
            </div>
        )
    }


    // const polygon = [
    //     [51.515, -0.09],
    //     [51.52, -0.1],
    //     [51.52, -0.12],
    // ]

    const purpleOptions = { color: 'purple' }

    return (
        <div>
            {/*<SearchLocation/>*/}
            {/*<GetMyLocation/>*/}
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{
                height: '650px',
                width: '100%',
            }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]} icon={new Icon({iconUrl: markerIconPng.src, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                    <Popup>
                        A pretty CSS3 popup. <br/> Easily customizable.
                    </Popup>
                </Marker>
                <Polygon pathOptions={purpleOptions} positions={polygon} />
            </MapContainer>
        </div>
    )
}

export default Map