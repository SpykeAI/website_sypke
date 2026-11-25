import { supabase } from "@/lib/supabase";

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

const BUCKET_NAME = "site-data";
const TEMPLATES_FILE_NAME = "sms_templates.json";

export async function getGlobalTemplates(): Promise<SmsTemplate[]> {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(TEMPLATES_FILE_NAME);
    if (error || !data) {
      await saveGlobalTemplates(DEFAULT_TEMPLATES);
      return DEFAULT_TEMPLATES;
    }
    const text = await data.text();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as SmsTemplate[];
    }
    return DEFAULT_TEMPLATES;
  } catch (err) {
    console.error("Error reading templates from Supabase storage:", err);
    return DEFAULT_TEMPLATES;
  }
}

export async function saveGlobalTemplates(templates: SmsTemplate[]): Promise<boolean> {
  try {
    const content = JSON.stringify(templates, null, 2);
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(TEMPLATES_FILE_NAME, content, {
        upsert: true,
        contentType: "application/json",
      });
    if (error) {
      console.error("Error saving templates to Supabase storage:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to save templates:", err);
    return false;
  }
}

export async function upsertGlobalTemplate(template: SmsTemplate): Promise<{ success: boolean; templates: SmsTemplate[] }> {
  const current = await getGlobalTemplates();
  const index = current.findIndex((t) => t.id === template.id);
  let updated: SmsTemplate[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...updated[index], ...template };
  } else {
    updated = [template, ...current];
  }
  const ok = await saveGlobalTemplates(updated);
  return { success: ok, templates: updated };
}

export async function deleteGlobalTemplate(id: string): Promise<{ success: boolean; templates: SmsTemplate[] }> {
  const current = await getGlobalTemplates();
  const updated = current.filter((t) => t.id !== id);
  const ok = await saveGlobalTemplates(updated);
  return { success: ok, templates: updated };
}
