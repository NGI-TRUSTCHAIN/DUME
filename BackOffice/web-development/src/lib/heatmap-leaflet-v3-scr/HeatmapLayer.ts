import PropTypes from 'prop-types';
import {filter, isNumber} from "lodash-es";

export type LngLat = {
    lng: number;
    lat: number;
}

export type Point = {
    x: number;
    y: number;
}

export type Bounds = {
    contains: (latLng: LngLat) => boolean;
}

export type Pane = {
    appendChild: (element: Object) => void;
}

export type Panes = {
    overlayPane: Pane;
}

export type Map = {
    layerPointToLatLng: (lngLat: Point) => LngLat;
    latLngToLayerPoint: (lngLat: LngLat) => Point;
    on: (event: string, handler: () => void) => void;
    getBounds: () => Bounds;
    getPanes: () => Panes;
    invalidateSize: () => void;
    options: Object;
}

export type LeafletZoomEvent = {
    zoom: number;
    center: Object;
}

function isInvalid(num: number): boolean {
    return !isNumber(num) && !num;
}

function isValid(num: number): boolean {
    return !isInvalid(num);
}

function isValidLatLngArray(arr: Array<number>): boolean {
    return filter(arr, isValid).length === arr.length;
}

function isInvalidLatLngArray(arr: Array<number>): boolean {
    return !isValidLatLngArray(arr);
}

function safeRemoveLayer(leafletMap: Map, el: any): void {
    const { overlayPane } = leafletMap.getPanes();
    if (overlayPane && overlayPane.contains(el)) {
        overlayPane.removeChild(el);
    }
}

function shouldIgnoreLocation(loc: LngLat): boolean {
    return isInvalid(loc.lng) || isInvalid(loc.lat);
}

export default withLeaflet(class HeatmapLayer extends MapLayer {
    static propTypes = {
        points: PropTypes.array.isRequired,
        longitudeExtractor: PropTypes.func.isRequired,
        latitudeExtractor: PropTypes.func.isRequired,
        intensityExtractor: PropTypes.func.isRequired,
        fitBoundsOnLoad: PropTypes.bool,
        fitBoundsOnUpdate: PropTypes.bool,
        onStatsUpdate: PropTypes.func,
        /* props controlling heatmap generation */
        max: PropTypes.number,
        radius: PropTypes.number,
        maxZoom: PropTypes.number,
        minOpacity: PropTypes.number,
        blur: PropTypes.number,
        gradient: PropTypes.object
    };

    private _el: any;
    private _heatmap: any;
    private _frame: any;

    createLeafletElement(): null {
        return null;
    }

    componentDidMount(): void {
        // Component did mount logic
    }

    getMax(props): number {
        return props.max || 3.0;
    }

    // Implement remaining methods
});
