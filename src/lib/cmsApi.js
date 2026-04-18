import { createClient } from "@supabase/supabase-js";
import { requireSupabase, supabaseAnonKey, supabaseUrl } from "./supabaseClient";
import { slugify } from "../utils/formatters";

function withSlug(devotional) {
  if (!devotional) return devotional;
  return {
    ...devotional,
    slug: devotional.slug || slugify(devotional.title),
  };
}

export async function fetchLatestDevotional(type) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("devotionals")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return withSlug(data);
}

export async function fetchDevotionalBySlug(type, slug) {
  const supabase = requireSupabase();

  const { data, error } = await supabase
    .from("devotionals")
    .select("*")
    .eq("type", type)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  const { data: fallback, error: fallbackError } = await supabase
    .from("devotionals")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false });

  if (fallbackError) throw fallbackError;

  return (fallback || []).map(withSlug).find((item) => item.slug === slug) ?? null;
}

export async function fetchDevotionals() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("devotionals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(withSlug);
}

export async function upsertDevotional(payload) {
  const supabase = requireSupabase();
  const devotionalPayload = {
    ...payload,
    slug: payload.slug || slugify(payload.title),
  };

  const { data, error } = await supabase
    .from("devotionals")
    .upsert(devotionalPayload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDevotional(id) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("devotionals").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchEvents(options = {}) {
  const supabase = requireSupabase();

  let query = supabase
    .from("events")
    .select("*")
    .order(options.orderBy || "date", { ascending: options.ascending ?? true });

  if (options.type) {
    query = query.eq("type", options.type);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function upsertEvent(payload) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("events")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchSermons() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function upsertSermon(payload) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("sermons")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSermon(id) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("sermons").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchMedia() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createMedia(payload) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("media").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function uploadToBucket(bucket, file, folder = "uploads") {
  const supabase = requireSupabase();

  const fileExt = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function fetchDashboardSummary() {
  const supabase = requireSupabase();
  const [devotionals, events, sermons, media] = await Promise.all([
    supabase.from("devotionals").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("sermons").select("id", { count: "exact", head: true }),
    supabase.from("media").select("id", { count: "exact", head: true }),
  ]);

  return {
    devotionals: devotionals.count || 0,
    events: events.count || 0,
    sermons: sermons.count || 0,
    media: media.count || 0,
  };
}

export async function fetchProfiles() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role")
    .order("email", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateProfileRole(id, role) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function createUserWithRole(payload) {
  const supabase = requireSupabase();
  const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: signupData, error: signupError } = await tempClient.auth.signUp({
    email: payload.email,
    password: payload.password,
  });

  if (signupError) throw signupError;

  const userId = signupData.user?.id;
  if (!userId) {
    throw new Error("User account was not created.");
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    email: payload.email,
    role: payload.role,
  });

  if (profileError) throw profileError;
  return userId;
}
