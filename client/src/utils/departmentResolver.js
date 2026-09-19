const civicDepartments = [
  {
    id: 1,
    name: "Road Maintenance Department",
    category: "Road Damage",
    latitude: 30.7333,
    longitude: 76.7794,
    contact: "1800-ROAD-01",
  },
  {
    id: 2,
    name: "Municipal Waste Management",
    category: "Waste",
    latitude: 30.7415,
    longitude: 76.7682,
    contact: "1800-WASTE-01",
  },
  {
    id: 3,
    name: "Street Lighting Division",
    category: "Street Light",
    latitude: 30.7276,
    longitude: 76.7831,
    contact: "1800-LIGHT-01",
  },
  {
    id: 4,
    name: "Water Supply & Sewerage Department",
    category: "Water",
    latitude: 30.7199,
    longitude: 76.8101,
    contact: "1800-WATER-01",
  },
  {
    id: 5,
    name: "Municipal Control Room",
    category: "Other",
    latitude: 30.735,
    longitude: 76.775,
    contact: "1800-CITY-01",
  },
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const radius = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return radius * c;
};

export const findNearestDepartment = ({
  latitude,
  longitude,
  category,
}) => {
  const categoryMatches =
    civicDepartments.filter(
      (department) =>
        department.category === category
    );

  const candidates =
    categoryMatches.length > 0
      ? categoryMatches
      : civicDepartments;

  const departmentsWithDistance =
    candidates.map((department) => ({
      ...department,

      distance: calculateDistance(
        latitude,
        longitude,
        department.latitude,
        department.longitude
      ),
    }));

  departmentsWithDistance.sort(
    (a, b) =>
      a.distance - b.distance
  );

  return departmentsWithDistance[0];
};

export default civicDepartments;