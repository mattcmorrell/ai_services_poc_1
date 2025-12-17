import { Client, Message } from "@/types/chat";

export const mockClients: Client[] = [
  { id: "1", name: "Silly Circuits Corp.", unreadCount: 6 },
  { id: "2", name: "Geeky Grotto Solutions", unreadCount: 0 },
  { id: "3", name: "Widget Wizards LLC", unreadCount: 1 },
  { id: "4", name: "Black Mesa Inc.", unreadCount: 4 },
  { id: "5", name: "Clever Components Inc.", unreadCount: 0 },
  { id: "6", name: "Techy Tacos Solutions", unreadCount: 0 },
  { id: "7", name: "Circuit Shenanigans Co.", unreadCount: 0 },
  { id: "8", name: "Java Jokesters Enterprises", unreadCount: 0 },
  { id: "9", name: "Firmware Follies Inc.", unreadCount: 2 },
];

export const mockMessages: Record<string, Message[]> = {
  "4": [
    {
      id: "msg-1",
      role: "assistant",
      content: `I'm ready to run payroll for Black Mesa. Here's my plan:

1. **Collect and Validate Data.** Gather all necessary input for the pay period, including employee hours worked, any changes in salary, and information about bonuses or commissions. This step also requires confirming that all tax withholding forms (like the W-4) and benefit deductions are accurate and current.

2. **Calculate Gross and Net Pay.** Determine the employee's gross pay before any deductions are taken out. Subsequently, calculate and subtract all mandatory deductions (federal/state taxes, FICA) and voluntary deductions (401(k), health insurance) to arrive at the final net pay.

3. **Disburse Payments and Provide Stubs.** Process the payment of the calculated net pay to the employees, usually through direct deposit or a physical check. Simultaneously, distribute a detailed pay stub to each employee showing a breakdown of their gross pay, all deductions, and final take-home amount.

4. **Report and Remit Taxes.** Deposit the withheld employee taxes and the employer's share of payroll taxes (like FICA match and unemployment taxes) to the proper government agencies by their deadlines. Finally, complete and file all required reports, such as quarterly Form 941 and annual W-2 forms.

Double check my work if you want, and approve when you're ready. I'll start as soon as it's approved.`,
      thinking: `The user is asking me to run payroll for Black Mesa Inc. This is a complex multi-step process that involves:
1. Data collection and validation
2. Payroll calculations
3. Payment processing
4. Tax reporting

I should break this down into clear steps and present a plan for approval before executing. This gives the HR consultant visibility into what I'm about to do and allows them to catch any issues before they become problems.

Let me structure this as a numbered list with clear explanations of each step...`,
      workflow: {
        id: "wf-1",
        name: "Black Mesa Payroll Workflow",
        description: "See workflow",
      },
      requiresApproval: true,
      approved: false,
      timestamp: new Date(),
    },
  ],
};
