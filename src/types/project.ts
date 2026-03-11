export interface Project {
  id: string;
  clientId: string;
  name: string;
  status: "active" | "completed" | "on_hold";
  description?: string;
  planId?: string; // links to a ProjectPlan if one exists
  createdAt: string;
}
