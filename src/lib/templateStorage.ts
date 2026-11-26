import { supabase } from "@/lib/supabase";

import {
  SmsTemplate,
  DEFAULT_TEMPLATES,
  TEMPLATES_STORAGE_KEY,
} from "./smsTemplates";

export type { SmsTemplate };
export { DEFAULT_TEMPLATES, TEMPLATES_STORAGE_KEY };

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
