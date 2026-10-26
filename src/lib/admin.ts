// Admin operations that work through RLS ("Admins can view/update/delete ..." policies using has_role).
// NOT here (needs the service-role key, so it needs a server proxy): listing auth emails, creating
// users, password-reset links, role assignment. Admin actions made here are also not written to the
// web app's activity_logs, because that table is only writable server-side.
import { supabase } from "@/lib/supabase";

const count = async (q: PromiseLike<{ count: number | null; error: { message: string } | null }>) => {
  const { count, error } = await q;
  if (error) throw new Error(error.message);
  return count ?? 0;
};
const head = { count: "exact", head: true } as const;

export async function getAdminDashboard() {
  const [users, vendors, pendingVendors, listings, activeListings, pendingListings, leads, reviews] = await Promise.all([
    count(supabase.from("profiles").select("id", head).is("deleted_at", null)),
    count(supabase.from("profiles").select("id", head).eq("account_type", "vendor")),
    count(supabase.from("profiles").select("id", head).eq("account_type", "vendor").eq("is_approved", false)),
    count(supabase.from("listings").select("id", head)),
    count(supabase.from("listings").select("id", head).eq("status", "active").eq("is_approved", true)),
    count(supabase.from("listings").select("id", head).eq("is_approved", false)),
    count(supabase.from("leads").select("id", head)),
    count(supabase.from("reviews").select("id", head)),
  ]);
  return { users, vendors, pendingVendors, listings, activeListings, pendingListings, leads, reviews };
}

export type AdminListing = { id: string; name: string; category: string; city: string; status: string; is_approved: boolean };
export async function getAdminListings(): Promise<AdminListing[]> {
  const { data, error } = await supabase.from("listings").select("id,name,category,city,status,is_approved").order("created_at", { ascending: false }).limit(300);
  if (error) throw new Error(error.message);
  return data ?? [];
}
export async function setListingApproval(id: string, approved: boolean) {
  const { error } = await supabase.from("listings").update({ is_approved: approved }).eq("id", id);
  if (error) throw new Error(error.message);
}
export async function deleteListing(id: string) {
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type AdminProfile = { id: string; full_name: string; phone: string | null; account_type: "customer" | "vendor"; is_approved: boolean; is_blocked: boolean; created_at: string };
export async function getProfiles(accountType?: "customer" | "vendor"): Promise<AdminProfile[]> {
  let q = supabase.from("profiles").select("id,full_name,phone,account_type,is_approved,is_blocked,created_at").is("deleted_at", null);
  if (accountType) q = q.eq("account_type", accountType);
  const { data, error } = await q.order("created_at", { ascending: false }).limit(300);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProfile[];
}
export async function patchProfile(id: string, patch: { is_approved?: boolean; is_blocked?: boolean }) {
  const { error } = await supabase.from("profiles").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export type AdminLead = { id: string; name: string; phone: string; requirement: string; status: string; created_at: string };
export async function getAdminLeads(): Promise<AdminLead[]> {
  const { data, error } = await supabase.from("leads").select("id,name,phone,requirement,status,created_at").order("created_at", { ascending: false }).limit(300);
  if (error) throw new Error(error.message);
  return data ?? [];
}
export async function deleteLead(id: string) {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type AdminReview = { id: string; customer_name: string; rating: number; body: string; created_at: string };
export async function getAdminReviews(): Promise<AdminReview[]> {
  const { data, error } = await supabase.from("reviews").select("id,customer_name,rating,body,created_at").order("created_at", { ascending: false }).limit(300);
  if (error) throw new Error(error.message);
  return data ?? [];
}
export async function deleteReview(id: string) {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
