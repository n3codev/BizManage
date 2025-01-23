import supabase from "./supabase";

export async function getSellers(page = 1) {
  const PAGE_SIZE = 4; // Page size should be consistent with the pagination

  const from = (page - 1) * PAGE_SIZE;
  const to = page * PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("seller")
    .select("*, isActive", { count: "exact" }) // Explicitly selecting isActive
    .range(from, to);

  if (error) {
    console.log("Error fetching sellers:", error.message);
    throw new Error("Sellers could not be loaded");
  }

  return { data, count }; // Return both data and count
}

// Delete a seller from the 'seller' table by ID
export async function deleteSeller(id) {
  const { data, error } = await supabase.from("seller").delete().eq("id", id);

  if (error) {
    throw new Error("Seller could not be deleted");
  }

  return data;
}
// Creating a sellers

export async function createSeller(newSeller) {
  const { data, error } = await supabase
    .from("seller")
    .insert([newSeller])
    .select();

  if (error) {
    console.log("Error creating seller:", error.message);
    throw new Error(`Seller could not be created: ${error.message}`);
  }

  return data;
}

/* EDIT */

export async function editSellers({ id, ...updates }) {
  if (!id || Object.keys(updates).length === 0) {
    throw new Error("ID and updates are required");
  }

  const { data, error } = await supabase
    .from("seller")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.log("Error editing invoice:", error);
    throw new Error("Invoice could not be edited");
  }

  return data;
}
