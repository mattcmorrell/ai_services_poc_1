export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  metadata?: {
    duration?: string;
    assignee?: string;
    status?: string;
    lastModified?: string;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

export interface WorkflowTab {
  id: string;
  type: "workflow" | "external";
  title: string;
  icon?: string;
  url?: string;
  workflowId?: string;
}
