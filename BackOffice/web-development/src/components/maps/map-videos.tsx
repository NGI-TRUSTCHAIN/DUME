'use client'

import {MapContainer, Marker, Polygon, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {useEffect, useState} from 'react'
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

    const heatmapData = [
        [37.7749, -122.4194, 50],
        // [37.4419, -122.143, 30],
        // [38.5816, -121.4944, 10],
        // [37.6879, -122.47, 20],
        // [37.3688, -122.0363, 15],
        // [37.7749, -122.4194, 40],
        // [37.4419, -122.143, 25],
        // [38.5816, -121.4944, 8],
        // [37.6879, -122.47, 15],
        // [37.3688, -122.0363, 10],

        [51.505, -0.09, 0.1],
        [51.106, -0.08, 0.5],
        [51.507, -0.07, 0.3],
        [51.505, -0.09, 0.1],
        [51.508, -0.07, 0.2],
        [51.509, -0.06, 0.7],
        [51.507, -0.08, 0.4],
        [51.504, -0.07, 0.6],
        [51.503, -0.09, 0.3],
        [51.506, -0.06, 0.2],

        [40.7128, -74.006, 100],
        [34.0522, -118.2437, 80],
        [41.8781, -87.6298, 70],
        [29.7604, -95.3698, 60],
        [42.3601, -71.0589, 50],
        [32.7157, -117.1611, 40],
        [39.9526, -75.1652, 30],
        [33.4484, -112.074, 20],
        [47.6062, -122.3321, 10],
        [38.9072, -77.0369, 5],

        [19.076, 72.8777, 50], // Mumbai
        [19.041, 73.0777, 10], // Mumbai
        [19.066, 73.8077, 20], // Mumbai
        [19.076, 73.3077, 30], // Mumbai
        [28.7041, 77.1025, 40], // Delhi
        [12.9716, 77.5946, 30], // Bangalore
        [22.5726, 88.3639, 20], // Kolkata
        [13.0827, 80.2707, 10], // Chennai
        [26.9124, 75.7873, 5], // Jaipur
        [17.385, 78.4867, 5], // Hyderabad
        [22.7196, 75.8577, 2], // Indore
        [19.076, 72.8777, 3]
    ];

    const heatmapOptions = {
        radius: 20,
        blur: 20,
        maxZoom: 18,
        minOpacity: 0.5,
        maxOpacity: 1
    };

    const [data, setData] = useState([]);

    // useEffect(() => {
    //     setData(heatmapData);
    // }, [data]);

    return (
        <div>
            <SearchLocation/>
            <GetMyLocation/>
            <MapContainer center={[32.37166518, -16.2749989]} zoom={8} scrollWheelZoom={false} style={{
                height: '400px',
                width: '100%'
            }}>

                {/*<HeatmapLayer*/}
                {/*    fitBoundsOnLoad*/}
                {/*    fitBoundsOnUpdate*/}
                {/*    points={data}*/}
                {/*    longitudeExtractor={(point) => point[1]}*/}
                {/*    latitudeExtractor={(point) => point[0]}*/}
                {/*    key={Math.random() + Math.random()}*/}
                {/*    intensityExtractor={(point) => parseFloat(point[2])}*/}
                {/*    {...heatmapOptions}*/}
                {/*/>*/}

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