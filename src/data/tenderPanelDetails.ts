import type {
  TeamTender,
  Tender,
  TenderComment,
  TenderListItem,
  TenderPanelUpdate,
  TenderPanelView,
  TenderQualification,
  UrgentTender,
} from "../types/tender";
import { deriveUploadDate } from "../utils/deadline";

const exemplarPanelDetails: Omit<
  TenderPanelView,
  | "id"
  | "name"
  | "location"
  | "deadline"
  | "urgency"
  | "urgencyLabel"
  | "status"
  | "owner"
  | "qualification"
> = {
  buyer: "Stadt Kempen",
  volumen: "Unbekannt",
  leistungsart:
    "Bauleistung, Generalunternehmerleistung, Objektplanung Gebäude",
  lp: "LP 1–9",
  gebaeudetyp: "Sport und Freizeit",
  verfahrensart: "Offenes Verfahren",
  entfernung: "53km",
  uploadDate: "06.06.2026",
  team: "Hochbau",
  partner: "Partner name",
  updates: [
    {
      title: "Update title",
      timestamp: "29.06.2026 | 10:50",
      description: "Neubau Pumpwerk & Druckleitung (LP 4-9) Bergisch Gladbach",
      isNew: true,
    },
    {
      title: "Update title",
      timestamp: "13.06.2026 | 12:31",
      description: "RV DGUV V3 Prüfungen Homeoffice",
    },
    {
      title: "Update title",
      timestamp: "07.06.2026 | 09:45",
      description: "RV Baubegleitende Kampfmittelsondiern",
    },
  ],
  comments: [
    {
      author: { name: "Marie Volker", initials: "M", color: "#24922f" },
      timestamp: "04.06.2026 | 11:05",
      preview: "Lorem ipsum dolor sit amet ipsum dolor sit amet.",
    },
    {
      author: { name: "Max Waltz", initials: "M", color: "#e91418" },
      timestamp: "04.06.2026 | 12:19",
      preview: "Lorem ipsum dolor sit amet ipsum dolor sit amet.",
    },
    {
      author: { name: "John Smith", initials: "J", color: "#a472e4" },
      timestamp: "18.06.2026 | 14:26",
      preview: "Lorem ipsum dolor sit amet ipsum dolor sit amet.",
    },
  ],
  timelineDescription:
    "Auftraggeber ist die Stadt Kempen (Schul- und Sportamt). Vergibt wird als Generalunternehmer die Planung und schlüsselfertige Errichtung eines neuen Umkleide-Ensembles im Familiensportpark an der Straelener Straße 45a/45b: zwei Umkleidegebäude mit Gemeinschafts-/Schulungsraum, öffentlichen WC-Anlagen, zwei Gerätehäusern und kompletter Außen- und TGA-Anbindung. Das Vorhaben ist eher ein kleiner Sportcampus als ein einzelnes Gebäude und verlangt die Koordination von Architektur, TGA, Statik, Brandschutz und Schallschutz. Auffällig sind die hohen Anforderungen an Vandalismusschutz, Barrierefreiheit und die umfangreiche technische Vernetzung der Gebäude.",
  timelineEvents: [
    { label: "Veröffentlicht", value: "04.06.2026" },
    { label: "Fragenfrist", value: "Unbekannt" },
    { label: "Abgabedatum", value: "07.07.2026 | 10:00" },
    { label: "Ausführungszeitraum", value: "07.09.2026 - 30.11.2027" },
  ],
  requirements: {
    mindestkriterien: 12,
    wertungTeilnahme: 0,
    zuschlagskriterien: 1,
    sections: [
      { label: "Referenzen", count: 1 },
      { label: "Team", count: 4 },
      { label: "Büro", count: 4 },
    ],
  },
};

function hashSeed(value: string): number {
  return value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function pickFrom<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

function deriveBuyer(location: string, seed: number): string {
  const city = location.split("•")[0]?.trim() ?? location;
  const cityName = city.replace(/^\d+\s+/, "").split(",")[0]?.trim() ?? city;

  if (cityName.startsWith("Stadt ")) {
    return cityName;
  }

  return pickFrom(
    [`Stadt ${cityName}`, `Land ${cityName}`, `${cityName} GmbH`],
    seed,
  );
}

function deriveGebaeudetyp(name: string, seed: number): string {
  const lower = name.toLowerCase();

  if (lower.includes("sport") || lower.includes("sporthalle")) {
    return "Sport und Freizeit";
  }
  if (lower.includes("schule") || lower.includes("gymnasium")) {
    return "Bildung";
  }
  if (lower.includes("verkehr") || lower.includes("straße")) {
    return "Verkehrsanlage";
  }
  if (lower.includes("wohn")) {
    return "Wohnen";
  }

  return pickFrom(
    ["Verwaltung", "Gesundheit", "Infrastruktur", "Sport und Freizeit"],
    seed,
  );
}

function deriveLeistungsart(tender: TenderListItem, seed: number): string {
  if ("leistungsart" in tender && tender.leistungsart) {
    return tender.leistungsart;
  }

  const lower = tender.name.toLowerCase();

  if (lower.includes("gu ") || lower.includes("generalunternehmer")) {
    return "Bauleistung, Generalunternehmerleistung, Objektplanung Gebäude";
  }
  if (lower.includes("objektplanung")) {
    return "Objektplanung Gebäude, Fachplanung";
  }
  if (lower.includes("bim")) {
    return "BIM-Planung, Objektplanung Gebäude";
  }

  return pickFrom(
    [
      "Objektplanung Gebäude, Tragwerksplanung",
      "Generalplanerleistung, Fachplanung TGA",
      "Städtebauliche Planung, Landschaftsplanung",
    ],
    seed,
  );
}

function deriveLp(tender: TenderListItem): string {
  if ("lp" in tender && tender.lp) {
    return tender.lp;
  }

  const match = tender.name.match(/LP\s*[\d–-]+/i);
  return match?.[0] ?? "LP 1–9";
}

function deriveVolumen(tender: TenderListItem): string {
  if ("volumen" in tender && tender.volumen) {
    return tender.volumen;
  }

  return "Unbekannt";
}

function deriveTeam(tender: TenderListItem, seed: number): string {
  if ("team" in tender && tender.team) {
    return tender.team;
  }

  return pickFrom(["Hochbau", "Tiefbau", "Verkehr", "Generalplanung"], seed);
}

/** Same team resolution used by the side panel (toTenderPanelView). */
export function getTenderTeam(tender: TenderListItem): string {
  if (tender.id === "1") {
    return exemplarPanelDetails.team;
  }

  return deriveTeam(tender, hashSeed(tender.id));
}

function buildUpdates(
  tender: Tender | UrgentTender | TeamTender,
  seed: number,
): TenderPanelUpdate[] {
  const updates: TenderPanelUpdate[] = [];

  if ("update" in tender && tender.update) {
    updates.push({
      title: "Update title",
      timestamp: deriveUploadDate(tender.deadline),
      description: tender.update.title,
      isNew: tender.update.isNew,
    });
  }

  if (updates.length === 0) {
    return [];
  }

  const extraUpdates = exemplarPanelDetails.updates.slice(1).map((update, index) => ({
    ...update,
    timestamp: update.timestamp.replace(
      /\d{2}\.\d{2}\.\d{4}/,
      deriveUploadDate(tender.deadline).replace(
        /\d{2}$/,
        String((seed + index) % 28).padStart(2, "0"),
      ),
    ),
  }));

  return [...updates, ...extraUpdates.slice(0, 2)];
}

function buildComments(
  tender: Tender | UrgentTender | TeamTender,
  seed: number,
): TenderComment[] {
  if ("comment" in tender && tender.comment) {
    const baseComment = tender.comment;
    return [
      baseComment,
      ...exemplarPanelDetails.comments.slice(1).map((comment, index) => ({
        ...comment,
        timestamp: `${String((seed + index) % 28).padStart(2, "0")}.06.2026 | 12:19`,
      })),
    ];
  }

  if (seed % 3 === 0) {
    return exemplarPanelDetails.comments.slice(0, 2);
  }

  return [];
}

function buildGeneratedDetails(tender: TenderListItem): Omit<
  TenderPanelView,
  | "id"
  | "name"
  | "location"
  | "deadline"
  | "urgency"
  | "urgencyLabel"
  | "status"
  | "owner"
  | "qualification"
> {
  const seed = hashSeed(tender.id);

  return {
    buyer: deriveBuyer(tender.location, seed),
    volumen: deriveVolumen(tender),
    leistungsart: deriveLeistungsart(tender, seed),
    lp: deriveLp(tender),
    gebaeudetyp: deriveGebaeudetyp(tender.name, seed),
    verfahrensart: pickFrom(
      ["Offenes Verfahren", "Nicht offenes Verfahren", "Verhandlungsverfahren"],
      seed,
    ),
    entfernung: `${40 + (seed % 120)}km`,
    uploadDate: deriveUploadDate(tender.deadline),
    team: deriveTeam(tender, seed),
    partner: pickFrom(
      ["Partner name", "Planungsbüro Nord", "Ingenieurgesellschaft Süd"],
      seed + 1,
    ),
    updates:
      "update" in tender
        ? buildUpdates(tender, seed)
        : exemplarPanelDetails.updates.slice(0, seed % 2 === 0 ? 2 : 1),
    comments:
      "comment" in tender
        ? buildComments(tender, seed)
        : exemplarPanelDetails.comments.slice(0, seed % 2 === 0 ? 3 : 1),
    timelineDescription: `Das Vergabeverfahren für ${tender.name} umfasst die Planung, Koordination und Umsetzung der ausgeschriebenen Leistungen am Standort ${tender.location}. Der Auftraggeber legt besonderen Wert auf termingerechte Abstimmung zwischen Fachplanungen, hohe Qualitätsstandards und eine transparente Kommunikation während der Angebotsphase.`,
    timelineEvents: [
      { label: "Veröffentlicht", value: deriveUploadDate(tender.deadline) },
      { label: "Fragenfrist", value: "Unbekannt" },
      {
        label: "Abgabedatum",
        value: tender.deadline.replace(/\d{2}:\d{2}$/, "10:00"),
      },
      {
        label: "Ausführungszeitraum",
        value: `${deriveUploadDate(tender.deadline).replace(/^\d{2}/, "07")} - 30.11.2027`,
      },
    ],
    requirements: {
      mindestkriterien: 8 + (seed % 8),
      wertungTeilnahme: seed % 3,
      zuschlagskriterien: 1 + (seed % 4),
      sections: [
        { label: "Referenzen", count: 1 + (seed % 3) },
        { label: "Team", count: 2 + (seed % 5) },
        { label: "Büro", count: 2 + (seed % 5) },
      ],
    },
  };
}

function getOwner(tender: TenderListItem) {
  if ("owner" in tender) {
    return tender.owner;
  }

  return null;
}

function getQualification(tender: TenderListItem): TenderQualification {
  if ("qualification" in tender) {
    return tender.qualification;
  }

  const seed = hashSeed(tender.id);
  return {
    votesYes: 1 + (seed % 4),
    votesNeutral: seed % 2,
    votesNo: seed % 3,
    relevanzScore: 2 + (seed % 4),
    komplexitaetScore: 2 + (seed % 4),
  };
}

export function toTenderPanelView(tender: TenderListItem): TenderPanelView {
  const generated =
    tender.id === "1"
      ? exemplarPanelDetails
      : buildGeneratedDetails(tender);

  return {
    id: tender.id,
    name: tender.name,
    location: tender.location,
    deadline: tender.deadline,
    urgency: tender.urgency,
    urgencyLabel: tender.urgencyLabel,
    status: tender.status,
    owner: getOwner(tender),
    qualification: getQualification(tender),
    ...generated,
  };
}
