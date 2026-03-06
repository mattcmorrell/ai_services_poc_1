export type DateConfidence = "exact" | "inferred" | "ambiguous";

export interface ProjectMilestone {
  id: string;
  title: string;
  date: string; // ISO date
  dateConfidence: DateConfidence;
  originalText?: string;
  completed: boolean;
}

export interface ProjectPhase {
  id: string;
  name: string;
  description?: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  startDateConfidence: DateConfidence;
  endDateConfidence: DateConfidence;
  milestones: ProjectMilestone[];
  status: "not_started" | "in_progress" | "completed";
  order: number;
}

export interface AmbiguousItem {
  id: string;
  type: "date" | "phase_boundary" | "milestone";
  description: string;
  originalText: string;
  suggestedValue?: string;
  resolved: boolean;
  resolvedValue?: string;
}

export interface ProjectPlan {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  phases: ProjectPhase[];
  importedAt: string; // ISO date
  updatedAt: string; // ISO date
  sourceFileName?: string;
  sourceType?: "pdf" | "spreadsheet" | "manual";
  version: number;
  ambiguousItems: AmbiguousItem[];
}

export interface ExtractedPlanData {
  title: string;
  description?: string;
  phases: ProjectPhase[];
  ambiguousItems: AmbiguousItem[];
}
