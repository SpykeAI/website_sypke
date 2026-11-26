export interface SmsTemplate {
  id: string;
  name: string;
  body: string;
  updatedAt: string;
  createdBy?: string;
}

export const DEFAULT_TEMPLATES: SmsTemplate[] = [
  {
    id: "tpl-1",
    name: "Medical Spa / Client Outreach",
    body: "Hi {name}, our aesthetic specialists in Dallas have priority consultation slots available this week. Reply YES to reserve your appointment!",
    updatedAt: "Today",
    createdBy: "Super Admin",
  },
  {
    id: "tpl-2",
    name: "HVAC Seasonal Tune-Up",
    body: "Hello {name}, did you schedule your seasonal HVAC inspection with {company}? Get 20% off before peak heat hits. Reply YES to confirm.",
    updatedAt: "Yesterday",
    createdBy: "Super Admin",
  },
  {
    id: "tpl-3",
    name: "Priority Consultation Follow-Up",
    body: "Hi {name}, following up on your inquiry with {company}. Would 2 PM or 4 PM work better for a brief 5-min review? Reply STOP to cancel.",
    updatedAt: "Nov 18",
    createdBy: "Super Admin",
  },
  {
    id: "tpl-4",
    name: "24/7 Emergency Dispatch Alert",
    body: "Urgent: A service technician from {company} has been assigned to your area. Please confirm availability at spykeai.com/confirm",
    updatedAt: "Nov 15",
    createdBy: "Super Admin",
  },
];

export const TEMPLATES_STORAGE_KEY = "spyke_sms_templates_v2";
