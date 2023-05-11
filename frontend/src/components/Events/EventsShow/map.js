import { Loader } from "@googlemaps/js-api-loader";
import { cloneElement, useEffect, useMemo, useRef, useState } from "react";
import "./map.scss"
const EventMap = ({ theaters, selected, setSelected, canSelect = true }) => {
    const mapRef = useRef();

    const theater = useMemo(() => theaters.find(theater => theater.name === selected), [theaters, selected]);
    const [markers, setMarkers] = useState([]);

    const pinBackgroundRef = useRef();
    const pinRefs = useRef([]);

    useEffect(() => {
        if (mapRef.current) {
            pinRefs.current = [];

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

                pinBackgroundRef.current = new PinElement({
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

                    pinRefs.current.push(new PinElement({
                        glyph: `${i + 1}`,
                    }).element);

                    event.addListener(marker, 'click', function() {
                        if (canSelect) setSelected(theaters.find(theater => theater.name === this.title));
                    });

                    return marker;
                });

                map.fitBounds(bounds);

                setMarkers(markers);
            });
        }
    }, [mapRef]);

    useEffect(() => {
        if (pinBackgroundRef.current && pinRefs.current && pinRefs.current.length && theater && markers) {
            markers.forEach((marker, i) => 
                marker.content = (
                    marker.title === theater.name 
                        ? pinBackgroundRef.current.cloneNode(true) 
                        : pinRefs.current[i].cloneNode(true)
                )
            );
        }
    }, [theater, pinBackgroundRef, pinRefs, markers])

    return <div className="google-map" ref={mapRef}/>
}

export default EventMap;