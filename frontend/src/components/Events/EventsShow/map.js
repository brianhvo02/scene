import { Loader } from "@googlemaps/js-api-loader";
import { cloneElement, useEffect, useMemo, useRef, useState } from "react";

const EventMap = ({ theaters, selected, setSelected }) => {
    const mapRef = useRef();

    const theater = useMemo(() => theaters[selected], [theaters, selected]);
    const [markers, setMarkers] = useState([]);

    const PinElementRef = useRef();

    useEffect(() => {
        if (mapRef.current) {
            const loader = new Loader({
                apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                version: "weekly"
            });
    
            loader.load().then(async google => {
                const [
                    { event, LatLngBounds },
                    { Map },
                    { AdvancedMarkerElement, PinElement }
                ] = await Promise.all([
                    'core',
                    'maps',
                    'marker'
                ].map(library => google.maps.importLibrary(library)));

                const map = new Map(mapRef.current, {
                    center: { lat: 37.0902, lng: -95.7129 },
                    zoom: 3,
                    disableDefaultUI: true,
                    fullscreenControl: true,
                    mapId: 'DEMO_MAP_ID'
                });

                const bounds = new LatLngBounds();

                const pinBackground = new PinElement({
                    background: "#FBBC04",
                });

                PinElementRef.current = new PinElement({
                    background: "#FBBC04",
                }).element;

                const markers = theaters.map((theater, i) => {
                    const pin = new PinElement({
                        glyph: `${i + 1}`,
                    });

                    const marker = new AdvancedMarkerElement({
                        title: theater.name, 
                        position: { 
                            lat: theater.geo.latitude, 
                            lng: theater.geo.longitude 
                        },
                        map,
                        content: pin.element
                    });

                    bounds.extend(marker.position);

                    event.addListener(marker, 'click', function() {
                        markers.forEach((marker, i) => {
                            const pin = new PinElement({
                                glyph: `${i + 1}`,
                            });
                            marker.content = pin.element;
                        });

                        this.content = pinBackground.element;
                        setSelected(theaters.find(theater => theater.name === this.title));
                    });

                    return marker;
                });

                map.fitBounds(bounds);

                setMarkers(markers);
            });
        }
    }, [mapRef]);

    useEffect(() => {
        if (PinElementRef.current) {
            console.log()
            const el = PinElementRef.current
            if (theater && markers[theater.name]) markers[theater.name].content = el;
        }
    }, [theater, PinElementRef, markers])

    return <div ref={mapRef} style={{
        height: '20em',
        width: '20em'
    }}/>
}

export default EventMap;