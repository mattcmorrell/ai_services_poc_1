import { Project } from "@/types/project";

const projectsByClient: Record<string, Project[]> = {
  // Aperture Science
  "1": [
    {
      id: "proj-1-1",
      clientId: "1",
      name: "Q1 Payroll Overhaul",
      status: "active",
      description: "Restructure payroll processing for 312 employees to comply with new state regulations",
      createdAt: "2026-01-15",
    },
    {
      id: "proj-1-2",
      clientId: "1",
      name: "New Hire Onboarding Redesign",
      status: "active",
      description: "Redesign onboarding flow for batch hiring cycles",
      createdAt: "2026-02-01",
    },
  ],

  // Umbrella Corp
  "2": [
    {
      id: "proj-2-1",
      clientId: "2",
      name: "Annual Performance Review Cycle",
      status: "active",
      description: "Full performance review cycle for 1,420 employees across all departments",
      createdAt: "2026-01-10",
    },
    {
      id: "proj-2-2",
      clientId: "2",
      name: "HRIS Migration",
      status: "active",
      description: "Migrate employee records from legacy HRIS to BambooHR",
      createdAt: "2025-11-01",
    },
  ],

  // Weyland-Yutani
  "3": [
    {
      id: "proj-3-1",
      clientId: "3",
      name: "Q2 Crew Rotation",
      status: "active",
      description: "Plan and execute station crew rotation for Q2 including hazard pay adjustments",
      createdAt: "2026-02-15",
    },
  ],

  // Black Mesa
  "4": [
    {
      id: "proj-4-1",
      clientId: "4",
      name: "Q2 Grant Allocation",
      status: "active",
      description: "Distribute research grant funding across 6 departments for Q2",
      createdAt: "2026-02-20",
    },
    {
      id: "proj-4-2",
      clientId: "4",
      name: "Lab Safety Re-certification",
      status: "active",
      description: "Complete annual lab safety certifications for all research staff",
      createdAt: "2026-01-05",
    },
  ],

  // Cyberdyne
  "5": [
    {
      id: "proj-5-1",
      clientId: "5",
      name: "March Onboarding Cohort",
      status: "active",
      description: "Onboard 5 new hires starting mid-March including I-9 and background checks",
      createdAt: "2026-02-25",
    },
  ],

  // Tyrell Corp
  "6": [
    {
      id: "proj-6-1",
      clientId: "6",
      name: "Q1 Tax Filing",
      status: "active",
      description: "Complete state and federal payroll tax filing for Q1",
      createdAt: "2026-03-01",
    },
    {
      id: "proj-6-2",
      clientId: "6",
      name: "Spring Promotion Cycle",
      status: "active",
      description: "Process promotions and compensation adjustments for engineering and design teams",
      createdAt: "2026-02-10",
    },
  ],
};

export function getClientProjects(clientId: string): Project[] {
  return projectsByClient[clientId] ?? [];
}

export function getProjectById(projectId: string): Project | undefined {
  for (const projects of Object.values(projectsByClient)) {
    const found = projects.find((p) => p.id === projectId);
    if (found) return found;
  }
  return undefined;
}
