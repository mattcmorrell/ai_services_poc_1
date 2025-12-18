import { Workflow } from "@/types/workflow";

export const defaultPayrollWorkflow: Workflow = {
  id: "wf-1",
  name: "Black Mesa Payroll Workflow",
  description: "See workflow",
  steps: [
    {
      id: "step-1",
      title: "Collect and Validate Data",
      description: "Gather all necessary input for the pay period, including employee hours worked, any changes in salary, and information about bonuses or commissions.",
      metadata: {
        duration: "~30 minutes",
        assignee: "HR System",
        status: "Pending",
        lastModified: "Dec 15, 2024",
      },
    },
    {
      id: "step-2",
      title: "Calculate Gross and Net Pay",
      description: "Determine the employee's gross pay before any deductions are taken out. Calculate and subtract all mandatory and voluntary deductions.",
      metadata: {
        duration: "~15 minutes",
        assignee: "Payroll Engine",
        status: "Pending",
        lastModified: "Dec 15, 2024",
      },
    },
    {
      id: "step-3",
      title: "Do the extra pay thing",
      description: "Process any additional compensation items such as bonuses, commissions, or reimbursements.",
      metadata: {
        duration: "~10 minutes",
        assignee: "Payroll Engine",
        status: "Pending",
        lastModified: "Dec 15, 2024",
      },
    },
    {
      id: "step-4",
      title: "Double check everything",
      description: "Review all calculations and verify accuracy before processing payments.",
      metadata: {
        duration: "~20 minutes",
        assignee: "HR Manager",
        status: "Pending",
        lastModified: "Dec 15, 2024",
      },
    },
    {
      id: "step-5",
      title: "Send the money",
      description: "Process the payment of the calculated net pay to the employees through direct deposit or physical check.",
      metadata: {
        duration: "~5 minutes",
        assignee: "Payment System",
        status: "Pending",
        lastModified: "Dec 15, 2024",
      },
    },
  ],
};
