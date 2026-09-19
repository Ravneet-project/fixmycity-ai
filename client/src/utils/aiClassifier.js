const ISSUE_RULES = [
  {
    category: "Road Damage",
    issue: "Road Pothole Detected",
    keywords: [
      "pothole",
      "road",
      "street",
      "crack",
      "broken road",
      "damaged road",
      "hole",
    ],
    severity: "High",
    priority: "Urgent",
    confidence: 96,
    description:
      "Possible road damage detected. The issue may affect vehicle safety and traffic movement. Immediate inspection is recommended.",
  },

  {
    category: "Waste",
    issue: "Garbage Overflow Detected",
    keywords: [
      "garbage",
      "waste",
      "trash",
      "dump",
      "dustbin",
      "rubbish",
      "dirty",
      "litter",
    ],
    severity: "Medium",
    priority: "High",
    confidence: 94,
    description:
      "Waste accumulation has been detected. This may create hygiene, odor and public health concerns. Municipal cleaning is recommended.",
  },

  {
    category: "Street Light",
    issue: "Street Light Issue Detected",
    keywords: [
      "light",
      "streetlight",
      "street light",
      "lamp",
      "dark",
      "electric",
      "electricity",
      "pole",
    ],
    severity: "Medium",
    priority: "High",
    confidence: 92,
    description:
      "A possible street lighting issue has been detected. Poor lighting may create visibility and public safety concerns.",
  },

  {
    category: "Water",
    issue: "Water Leakage Detected",
    keywords: [
      "water",
      "leak",
      "leakage",
      "pipe",
      "drain",
      "sewage",
      "sewer",
      "overflow",
      "flood",
    ],
    severity: "High",
    priority: "Urgent",
    confidence: 95,
    description:
      "A possible water leakage or drainage issue has been detected. Inspection is recommended to prevent water loss and infrastructure damage.",
  },

  {
    category: "Public Safety",
    issue: "Public Safety Hazard Detected",
    keywords: [
      "danger",
      "unsafe",
      "broken",
      "accident",
      "hazard",
      "wire",
      "open",
      "damage",
    ],
    severity: "High",
    priority: "Urgent",
    confidence: 89,
    description:
      "A potential public safety hazard has been identified. The location should be inspected by the responsible civic department.",
  },
];

const calculateConfidence = (rule, text) => {
  const matchedKeywords =
    rule.keywords.filter((keyword) =>
      text.includes(keyword)
    );

  if (matchedKeywords.length >= 3) {
    return Math.min(
      rule.confidence + 2,
      99
    );
  }

  if (matchedKeywords.length === 2) {
    return rule.confidence;
  }

  if (matchedKeywords.length === 1) {
    return Math.max(
      rule.confidence - 4,
      82
    );
  }

  return 0;
};

export const classifyCivicIssue = ({
  fileName = "",
  description = "",
  location = "",
}) => {
  const text = `
    ${fileName}
    ${description}
    ${location}
  `
    .toLowerCase()
    .replace(/[_-]/g, " ");

  const results =
    ISSUE_RULES.map((rule) => ({
      ...rule,
      calculatedConfidence:
        calculateConfidence(
          rule,
          text
        ),
    })).sort(
      (a, b) =>
        b.calculatedConfidence -
        a.calculatedConfidence
    );

  const bestMatch = results[0];

  if (
    bestMatch.calculatedConfidence >
    0
  ) {
    return {
      issue: bestMatch.issue,
      category:
        bestMatch.category,
      severity:
        bestMatch.severity,
      priority:
        bestMatch.priority,
      confidence:
        bestMatch.calculatedConfidence,
      description:
        bestMatch.description,
    };
  }

  return {
    issue: "Civic Issue Detected",
    category: "Other",
    severity: "Medium",
    priority: "Normal",
    confidence: 78,
    description:
      "FixMyCity AI detected a possible civic issue. Additional information may help authorities classify and resolve the complaint more accurately.",
  };
};