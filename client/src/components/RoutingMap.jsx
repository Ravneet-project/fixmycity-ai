import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import {
  divIcon,
  latLngBounds,
} from "leaflet";

import {
  useEffect,
} from "react";

import {
  Building2,
  MapPin,
  Navigation,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

const issueIcon = divIcon({
  className: "custom-map-marker",

  html: `
    <div class="real-map-marker issue-map-marker">
      <div class="real-map-marker-pulse"></div>
      <div class="real-map-marker-dot">●</div>
    </div>
  `,

  iconSize: [44, 44],

  iconAnchor: [22, 22],
});

const departmentIcon = divIcon({
  className: "custom-map-marker",

  html: `
    <div class="real-map-marker department-map-marker">
      <div class="real-map-marker-pulse"></div>
      <div class="department-map-icon">🏢</div>
    </div>
  `,

  iconSize: [46, 46],

  iconAnchor: [23, 23],
});

const FitMapBounds = ({
  issuePosition,
  departmentPosition,
}) => {
  const map =
    useMap();

  useEffect(() => {
    if (
      !issuePosition ||
      !departmentPosition
    ) {
      return;
    }

    const bounds =
      latLngBounds([
        issuePosition,
        departmentPosition,
      ]);

    map.fitBounds(
      bounds,
      {
        padding: [70, 70],

        maxZoom: 14,
      }
    );
  }, [
    map,
    issuePosition,
    departmentPosition,
  ]);

  return null;
};

const RoutingMap = ({
  coordinates,
  department,
}) => {
  if (
    !coordinates ||
    !department
  ) {
    return null;
  }

  const issueLatitude =
    Number(
      coordinates.latitude
    );

  const issueLongitude =
    Number(
      coordinates.longitude
    );

  const departmentLatitude =
    Number(
      department.latitude
    );

  const departmentLongitude =
    Number(
      department.longitude
    );

  const hasValidIssueCoordinates =
    Number.isFinite(
      issueLatitude
    ) &&
    Number.isFinite(
      issueLongitude
    );

  const hasValidDepartmentCoordinates =
    Number.isFinite(
      departmentLatitude
    ) &&
    Number.isFinite(
      departmentLongitude
    );

  if (
    !hasValidIssueCoordinates ||
    !hasValidDepartmentCoordinates
  ) {
    return (
      <div className="real-routing-map-card">
        <div className="real-map-error">
          Map routing data is unavailable for this report.
        </div>
      </div>
    );
  }

  const issuePosition = [
    issueLatitude,
    issueLongitude,
  ];

  const departmentPosition = [
    departmentLatitude,
    departmentLongitude,
  ];

  const routePositions = [
    issuePosition,
    departmentPosition,
  ];

  return (
    <div className="real-routing-map-card">
      <div className="real-routing-map-header">
        <div>
          <span>
            LIVE CIVIC ROUTING
          </span>

          <h3>
            Smart Location Map
          </h3>

          <p>
            Explore the reported civic issue and
            assigned department on a real interactive map.
          </p>
        </div>

        <div className="real-map-live">
          <i></i>

          LIVE MAP
        </div>
      </div>

      <div className="real-map-container">
        <MapContainer
          center={
            issuePosition
          }
          zoom={13}
          scrollWheelZoom={
            true
          }
          className="leaflet-civic-map"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitMapBounds
            issuePosition={
              issuePosition
            }
            departmentPosition={
              departmentPosition
            }
          />

          <Marker
            position={
              issuePosition
            }
            icon={
              issueIcon
            }
          >
            <Popup>
              <div className="map-popup-content">
                <strong>
                  Issue Location
                </strong>

                <span>
                  Reported civic problem
                </span>
              </div>
            </Popup>
          </Marker>

          <Marker
            position={
              departmentPosition
            }
            icon={
              departmentIcon
            }
          >
            <Popup>
              <div className="map-popup-content">
                <strong>
                  {
                    department.name
                  }
                </strong>

                <span>
                  Assigned Civic Department
                </span>
              </div>
            </Popup>
          </Marker>

          <Polyline
            positions={
              routePositions
            }
            pathOptions={{
              weight: 5,

              opacity: 0.9,

              dashArray:
                "10 10",
            }}
          />
        </MapContainer>

        <div className="map-route-overlay">
          <Navigation
            size={14}
          />

          Auto-routed civic issue
        </div>
      </div>

      <div className="real-map-info-grid">
        <div>
          <MapPin
            size={17}
          />

          <span>
            ISSUE LOCATION
          </span>

          <strong>
            Reported Location
          </strong>
        </div>

        <div>
          <Building2
            size={17}
          />

          <span>
            ASSIGNED TO
          </span>

          <strong>
            {
              department.name
            }
          </strong>
        </div>

        <div>
          <Navigation
            size={17}
          />

          <span>
            DISTANCE
          </span>

          <strong>
            {
              department.distance
            }{" "}
            km
          </strong>
        </div>
      </div>
    </div>
  );
};

export default RoutingMap;