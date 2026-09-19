import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import {
  divIcon,
  latLngBounds,
} from "leaflet";

import {
  Building2,
  MapPin,
  Navigation,
} from "lucide-react";

import "leaflet/dist/leaflet.css";
import "./CityIssuesMap.css";

import {
  getSavedReports,
} from "../utils/reportStorage";

const issueIcon = divIcon({
  className: "fmc-map-icon-wrap",
  html: `
    <div class="fmc-map-marker fmc-map-marker-issue">
      <span></span>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const departmentIcon = divIcon({
  className: "fmc-map-icon-wrap",
  html: `
    <div class="fmc-map-marker fmc-map-marker-department">
      <b>🏢</b>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const FitBounds = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) {
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }

    const bounds =
      latLngBounds(points);

    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 12,
    });
  }, [map, points]);

  return null;
};

const CityIssuesMap = () => {
  const [reports, setReports] =
    useState(() =>
      getSavedReports()
    );

  useEffect(() => {
    const refresh = () => {
      setReports(
        getSavedReports()
      );
    };

    window.addEventListener(
      "fixmycity-report-added",
      refresh
    );

    window.addEventListener(
      "fixmycity-reports-updated",
      refresh
    );

    window.addEventListener(
      "storage",
      refresh
    );

    return () => {
      window.removeEventListener(
        "fixmycity-report-added",
        refresh
      );

      window.removeEventListener(
        "fixmycity-reports-updated",
        refresh
      );

      window.removeEventListener(
        "storage",
        refresh
      );
    };
  }, []);

  const validReports =
    useMemo(
      () =>
        reports.filter(
          (report) => {
            const lat =
              Number(
                report
                  ?.coordinates
                  ?.latitude
              );

            const lng =
              Number(
                report
                  ?.coordinates
                  ?.longitude
              );

            return (
              Number.isFinite(
                lat
              ) &&
              Number.isFinite(
                lng
              )
            );
          }
        ),
      [reports]
    );

  const departments =
    useMemo(() => {
      const unique =
        new Map();

      validReports.forEach(
        (report) => {
          const department =
            report.assignedDepartment;

          if (!department) {
            return;
          }

          const lat =
            Number(
              department.latitude
            );

          const lng =
            Number(
              department.longitude
            );

          if (
            !Number.isFinite(
              lat
            ) ||
            !Number.isFinite(
              lng
            )
          ) {
            return;
          }

          const key =
            department.id ||
            `${department.name}-${lat}-${lng}`;

          if (
            !unique.has(key)
          ) {
            unique.set(
              key,
              {
                ...department,
                latitude: lat,
                longitude: lng,
                issueCount: 1,
              }
            );
          } else {
            unique.get(
              key
            ).issueCount += 1;
          }
        }
      );

      return Array.from(
        unique.values()
      );
    }, [validReports]);

  const points =
    useMemo(() => {
      const all = [];

      validReports.forEach(
        (report) => {
          all.push([
            Number(
              report
                .coordinates
                .latitude
            ),
            Number(
              report
                .coordinates
                .longitude
            ),
          ]);
        }
      );

      departments.forEach(
        (department) => {
          all.push([
            department.latitude,
            department.longitude,
          ]);
        }
      );

      return all;
    }, [
      validReports,
      departments,
    ]);

  const defaultCenter =
    points[0] || [
      31.326,
      75.5762,
    ];

  const activeCount =
    validReports.filter(
      (item) =>
        item.status !==
        "Resolved"
    ).length;

  const resolvedCount =
    validReports.filter(
      (item) =>
        item.status ===
        "Resolved"
    ).length;

  const cityCount =
    new Set(
      validReports
        .map(
          (item) =>
            item
              ?.assignedDepartment
              ?.city
        )
        .filter(Boolean)
    ).size;

  return (
    <div className="fmc-city-map-card">
      <div className="fmc-city-map-head">
        <div>
          <span>
            LIVE CIVIC ACTIVITY
          </span>

          <h3>
            Real City Issue Map
          </h3>

          <p>
            Real submitted issue
            locations and assigned
            civic departments.
          </p>
        </div>

        <div className="fmc-map-live">
          <i></i>
          Live
        </div>
      </div>

      <div className="fmc-map-shell">
        <MapContainer
          center={defaultCenter}
          zoom={11}
          scrollWheelZoom
          className="fmc-leaflet-map"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds
            points={points}
          />

          {validReports.map(
            (report) => (
              <Marker
                key={
                  report.complaintId ||
                  report.id
                }
                position={[
                  Number(
                    report
                      .coordinates
                      .latitude
                  ),
                  Number(
                    report
                      .coordinates
                      .longitude
                  ),
                ]}
                icon={issueIcon}
              >
                <Popup>
                  <div className="fmc-map-popup">
                    <strong>
                      {report.title ||
                        "Civic Issue"}
                    </strong>

                    <span>
                      {report.location ||
                        "Location unavailable"}
                    </span>

                    {report.complaintId && (
                      <small>
                        {
                          report.complaintId
                        }
                      </small>
                    )}

                    <em>
                      {report.status ||
                        "Reported"}
                    </em>
                  </div>
                </Popup>
              </Marker>
            )
          )}

          {departments.map(
            (department) => (
              <Marker
                key={
                  department.id ||
                  department.name
                }
                position={[
                  department.latitude,
                  department.longitude,
                ]}
                icon={
                  departmentIcon
                }
              >
                <Popup>
                  <div className="fmc-map-popup">
                    <strong>
                      {
                        department.name
                      }
                    </strong>

                    <span>
                      {department.city ||
                        "Civic Department"}
                    </span>

                    <small>
                      {
                        department.issueCount
                      }{" "}
                      assigned issue
                      {department.issueCount ===
                      1
                        ? ""
                        : "s"}
                    </small>
                  </div>
                </Popup>
              </Marker>
            )
          )}
        </MapContainer>

        <div className="fmc-map-legend">
          <div>
            <MapPin
              size={13}
            />
            Issue
          </div>

          <div>
            <Building2
              size={13}
            />
            Department
          </div>

          <div>
            <Navigation
              size={13}
            />
            Drag & Zoom
          </div>
        </div>
      </div>

      <div className="fmc-map-stats">
        <div>
          <span>
            Active
          </span>
          <strong>
            {activeCount}
          </strong>
        </div>

        <div>
          <span>
            Resolved
          </span>
          <strong>
            {resolvedCount}
          </strong>
        </div>

        <div>
          <span>
            Departments
          </span>
          <strong>
            {departments.length}
          </strong>
        </div>

        <div>
          <span>
            Cities
          </span>
          <strong>
            {cityCount}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default CityIssuesMap;
