import { ProjectPlan } from "@/types/project-plan";

const projectPlanData: Record<string, ProjectPlan[]> = {
  // Black Mesa (id "4") — Real Ashtead Technology Performance Management data
  "4": [
    {
      id: "plan-pm-4-1",
      clientId: "4",
      title: "Performance Management Initiative",
      description: "End-to-end rollout of performance management framework including discovery, design, build, pilot, and full launch.",
      phases: [
        {
          id: "phase-4-1",
          name: "Discovery & Assessment",
          description: "Stakeholder interviews, current-state analysis, and requirements gathering",
          startDate: "2026-01-06",
          endDate: "2026-02-14",
          startDateConfidence: "exact",
          endDateConfidence: "exact",
          milestones: [
            { id: "ms-4-1-1", title: "Stakeholder interviews complete", date: "2026-01-24", dateConfidence: "exact", completed: true },
            { id: "ms-4-1-2", title: "Current-state assessment delivered", date: "2026-02-07", dateConfidence: "exact", completed: true },
            { id: "ms-4-1-3", title: "Requirements document signed off", date: "2026-02-14", dateConfidence: "exact", completed: true },
          ],
          status: "completed",
          order: 1,
        },
        {
          id: "phase-4-2",
          name: "Design & Strategy",
          description: "Competency framework design, rating scales, review cycle configuration",
          startDate: "2026-02-17",
          endDate: "2026-03-28",
          startDateConfidence: "exact",
          endDateConfidence: "exact",
          milestones: [
            { id: "ms-4-2-1", title: "Competency framework draft", date: "2026-03-06", dateConfidence: "exact", completed: false },
            { id: "ms-4-2-2", title: "Review cycle design approved", date: "2026-03-14", dateConfidence: "exact", completed: false },
            { id: "ms-4-2-3", title: "Manager calibration process defined", date: "2026-03-28", dateConfidence: "exact", completed: false },
          ],
          status: "in_progress",
          order: 2,
        },
        {
          id: "phase-4-3",
          name: "System Build & Configuration",
          description: "BambooHR Performance module setup, form creation, workflow configuration",
          startDate: "2026-03-31",
          endDate: "2026-05-09",
          startDateConfidence: "exact",
          endDateConfidence: "inferred",
          milestones: [
            { id: "ms-4-3-1", title: "Review forms configured", date: "2026-04-11", dateConfidence: "exact", completed: false },
            { id: "ms-4-3-2", title: "Workflow automation tested", date: "2026-04-25", dateConfidence: "inferred", originalText: "late April", completed: false },
            { id: "ms-4-3-3", title: "UAT environment ready", date: "2026-05-09", dateConfidence: "exact", completed: false },
          ],
          status: "not_started",
          order: 3,
        },
        {
          id: "phase-4-4",
          name: "Pilot & Training",
          description: "Pilot with select departments, manager training sessions, feedback collection",
          startDate: "2026-05-12",
          endDate: "2026-06-20",
          startDateConfidence: "exact",
          endDateConfidence: "inferred",
          milestones: [
            { id: "ms-4-4-1", title: "Pilot group kickoff", date: "2026-05-12", dateConfidence: "exact", completed: false },
            { id: "ms-4-4-2", title: "Manager training complete", date: "2026-06-06", dateConfidence: "inferred", originalText: "early June", completed: false },
            { id: "ms-4-4-3", title: "Pilot feedback review", date: "2026-06-20", dateConfidence: "inferred", originalText: "mid-to-late June", completed: false },
          ],
          status: "not_started",
          order: 4,
        },
        {
          id: "phase-4-5",
          name: "Full Launch & Support",
          description: "Company-wide rollout, communication campaign, ongoing support setup",
          startDate: "2026-07-06",
          endDate: "2026-08-14",
          startDateConfidence: "inferred",
          endDateConfidence: "ambiguous",
          milestones: [
            { id: "ms-4-5-1", title: "Company-wide launch", date: "2026-07-06", dateConfidence: "inferred", originalText: "early July", completed: false },
            { id: "ms-4-5-2", title: "First review cycle initiated", date: "2026-07-20", dateConfidence: "ambiguous", originalText: "2-3 weeks after launch", completed: false },
            { id: "ms-4-5-3", title: "Post-launch retrospective", date: "2026-08-14", dateConfidence: "ambiguous", originalText: "~6 weeks after launch", completed: false },
          ],
          status: "not_started",
          order: 5,
        },
      ],
      importedAt: "2026-02-20T10:30:00Z",
      updatedAt: "2026-03-01T14:15:00Z",
      sourceFileName: "Ashtead_PerfMgmt_ProjectPlan_2026.pdf",
      sourceType: "pdf",
      version: 2,
      ambiguousItems: [
        {
          id: "amb-4-1",
          type: "date",
          description: "Workflow automation testing date is vague",
          originalText: "late April",
          suggestedValue: "2026-04-25",
          resolved: false,
        },
        {
          id: "amb-4-2",
          type: "phase_boundary",
          description: "Full Launch start date depends on pilot completion",
          originalText: "early July",
          suggestedValue: "2026-07-06",
          resolved: false,
        },
        {
          id: "amb-4-3",
          type: "milestone",
          description: "First review cycle timing is relative, not fixed",
          originalText: "2-3 weeks after launch",
          suggestedValue: "2026-07-20",
          resolved: false,
        },
      ],
    },
  ],

  // Aperture Science (id "1") — Fictional Portal Gun Safety Recertification
  "1": [
    {
      id: "plan-pg-1-1",
      clientId: "1",
      title: "Portal Gun Safety Recertification",
      description: "Annual safety recertification program for all portal gun operators, including updated training modules and compliance testing.",
      phases: [
        {
          id: "phase-1-1",
          name: "Curriculum Update",
          description: "Review and update safety training materials for current portal gun models",
          startDate: "2026-02-03",
          endDate: "2026-03-07",
          startDateConfidence: "exact",
          endDateConfidence: "exact",
          milestones: [
            { id: "ms-1-1-1", title: "Safety manual revision complete", date: "2026-02-21", dateConfidence: "exact", completed: true },
            { id: "ms-1-1-2", title: "Training videos updated", date: "2026-03-07", dateConfidence: "exact", completed: true },
          ],
          status: "completed",
          order: 1,
        },
        {
          id: "phase-1-2",
          name: "Certification Testing",
          description: "Deploy written and practical exams for all 312 operators",
          startDate: "2026-03-10",
          endDate: "2026-04-18",
          startDateConfidence: "exact",
          endDateConfidence: "ambiguous",
          milestones: [
            { id: "ms-1-2-1", title: "Written exams deployed", date: "2026-03-10", dateConfidence: "exact", completed: false },
            { id: "ms-1-2-2", title: "Practical exams scheduled", date: "2026-03-24", dateConfidence: "inferred", originalText: "roughly 2 weeks after written", completed: false },
            { id: "ms-1-2-3", title: "All operators tested", date: "2026-04-18", dateConfidence: "ambiguous", originalText: "4-6 weeks from start", completed: false },
          ],
          status: "in_progress",
          order: 2,
        },
        {
          id: "phase-1-3",
          name: "Remediation & Compliance Filing",
          description: "Retesting for failed operators, OSHA compliance filing",
          startDate: "2026-04-21",
          endDate: "2026-05-16",
          startDateConfidence: "inferred",
          endDateConfidence: "ambiguous",
          milestones: [
            { id: "ms-1-3-1", title: "Retesting complete", date: "2026-05-02", dateConfidence: "ambiguous", originalText: "early May", completed: false },
            { id: "ms-1-3-2", title: "OSHA filing submitted", date: "2026-05-16", dateConfidence: "ambiguous", originalText: "mid-May deadline", completed: false },
          ],
          status: "not_started",
          order: 3,
        },
      ],
      importedAt: "2026-02-10T09:00:00Z",
      updatedAt: "2026-02-10T09:00:00Z",
      sourceFileName: "PortalGun_Safety_Recert_2026.xlsx",
      sourceType: "spreadsheet",
      version: 1,
      ambiguousItems: [
        {
          id: "amb-1-1",
          type: "date",
          description: "Practical exam scheduling depends on written exam completion rates",
          originalText: "roughly 2 weeks after written",
          suggestedValue: "2026-03-24",
          resolved: false,
        },
        {
          id: "amb-1-2",
          type: "phase_boundary",
          description: "Remediation phase start depends on testing completion",
          originalText: "4-6 weeks from start",
          suggestedValue: "2026-04-18",
          resolved: false,
        },
      ],
    },
  ],
};

export function getClientProjectPlans(clientId: string): ProjectPlan[] {
  return projectPlanData[clientId] ?? [];
}

export function getAllProjectPlans(): Record<string, ProjectPlan[]> {
  return { ...projectPlanData };
}
