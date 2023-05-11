import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

const EventMap = ({ theatre }) => {
    const mapRef = useRef();

    useEffect(() => {
        if (mapRef.current) {
            const loader = new Loader({
                apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                version: "weekly"
            });
    
            loader.load().then(async google => {
                const [
                    { Map },
                    { Marker }
                ] = await Promise.all([
                    'maps',
                    'marker'
                ].map(library => google.maps.importLibrary(library)));
    
                const map = new Map(mapRef.current, {
                    center: { lat: theatre.lat, lng: theatre.lng },
                    zoom: 16,
                    disableDefaultUI: true,
                    fullscreenControl: true
                });
                new Marker({ position: { lat: theatre.lat, lng: theatre.lng }, map });
            });
        }
    }, [mapRef]);

    return <div ref={mapRef} style={{
        height: '20em',
        width: '20em'
    }}/>
}

export default EventMap;