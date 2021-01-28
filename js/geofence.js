let shapeCoordinates;
let shapeObject;

function initMap () {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -6.79694, lng: 39.2481 },
        zoom: 14,
    });

    const mapOverlayDefinitions = {
        //returns array with storable google.maps.Overlay-definitions
        innerArrayMapOverlay: function (arr, encoded) {
            let shapes = [],
                fence = google.maps,
                shape, tmp;
            for (let i = 0; i < arr.length; i++) {
                shape = arr[i];
                tmp = {type: this.t_(shape.type), id: shape.id || null};
                switch (tmp.type) {
                    case 'CIRCLE':
                        tmp.radius = shape.getRadius();
                        tmp.geometry = this.p_(shape.getCenter());
                        break;
                    case 'MARKER':
                        tmp.geometry = this.p_(shape.getPosition());
                        break;
                    case 'RECTANGLE':
                        tmp.geometry = this.b_(shape.getBounds());
                        break;
                    case 'POLYGON':
                        tmp.geometry = this.m_(shape.getPaths(), encoded);
                        break;
                }
                shapes.push(tmp);
            }
            return shapes;
        },
        //returns array with google.maps.Overlays
        outerArrayMapOverlay: function (arr, map) {
            let shapes = [],
                overlayGeoFence = google.maps,
                myMap = map || null,
                shape, tmp;
            for (let i = 0; i < arr.length; i++) {
                shape = arr[i];
                switch (shape.type) {
                    case 'CIRCLE':
                        tmp = new overlayGeoFence.Circle({radius: Number(shape.radius), center: this.pp_.apply(this, shape.geometry)});
                        break;
                    case 'MARKER':
                        tmp = new overlayGeoFence.Marker({position: this.pp_.apply(this, shape.geometry)});
                        break;
                    case 'RECTANGLE':
                        tmp = new overlayGeoFence.Rectangle({bounds: this.bb_.apply(this, shape.geometry)});
                        break;
                    case 'POLYGON':
                        tmp = new overlayGeoFence.Polygon({paths: this.mm_(shape.geometry)});
                        break;
                }
                tmp.setValues({map: myMap, id: shape.id});
                shapes.push(tmp);
            }
            return shapes;
        },
        l_: function (path, e) {
            path = (path.getArray) ? path.getArray() : path;
            if (e) {
                return google.maps.geometry.encoding.encodePath(path);
            } else {
                const r = [];
                for (let i = 0; i < path.length; ++i) {
                    r.push(this.p_(path[i]));
                }
                return r;
            }
        },
        ll_: function (path) {
            if (typeof path === 'string') {
                return google.maps.geometry.encoding.decodePath(path);
            } else {
                const r = [];
                for (let i = 0; i < path.length; ++i) {
                    r.push(this.pp_.apply(this, path[i]));
                }
                return r;
            }
        },
        m_: function (paths, e) {
            const r = [];
            paths = (paths.getArray) ? paths.getArray() : paths;
            for (let i = 0; i < paths.length; ++i) {
                r.push(this.l_(paths[i], e));
            }
            return r;
        },
        mm_: function (paths) {
            const r = [];
            for (let i = 0; i < paths.length; ++i) {
                r.push(this.ll_.call(this, paths[i]));
            }
            return r;
        },
        p_: function (latLng) {
            return ([latLng.lat(), latLng.lng()]);
        },
        pp_: function (lat, lng) {
            return new google.maps.LatLng(lat, lng);
        },
        b_: function (bounds) {
            return ([this.p_(bounds.getSouthWest()),
                this.p_(bounds.getNorthEast())]);
        },
        bb_: function (sw, ne) {
            return new google.maps.LatLngBounds(this.pp_.apply(this, sw),
                this.pp_.apply(this, ne));
        },
        t_: function (s) {
            const t = ['CIRCLE', 'MARKER', 'RECTANGLE', 'POLYGON'];
            for (let i = 0; i < t.length; ++i) {
                if (s === google.maps.drawing.OverlayType[t[i]]) {
                    return t[i];
                }
            }
        }
    };

    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.RECTANGLE,
            ],
        },
        circleOptions: {
            strokeColor: '#FF9800',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF9800',
            fillOpacity: 0.35,
            clickable: true,
            editable: true,
            draggable: true,
            zIndex: 1
        },
        polygonOptions: {
            clickable: true,
            draggable: true,
            editable: true,
            strokeColor: '#FF9800',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF9800',
            fillOpacity: 0.35,
            geodesic: true

        },
        rectangleOptions: {
            clickable: true,
            draggable: true,
            editable: true,
            strokeColor: '#FF9800',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF9800',
            fillOpacity: 0.35,
        },
    });


    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
        const shape = e.overlay;
        shape.type = e.type;
        google.maps.event.addListener(shape, 'click', function () {
            setSelection(this);
        });
        setSelection(shape);
        shapes = [];
        shapes.push(shape);
        const _coordinates = mapOverlayDefinitions.innerArrayMapOverlay(shapes, false);
        shapeObject = shapes;
        shapeCoordinates = _coordinates;
        console.log("Coordinates", _coordinates)
    });

    drawingManager.setMap(map);
}

function setSelection(selectedObject){
    console.log("Object", selectedObject)
}
