import supabase from "./supabase";

export async function getCustomers(page = 1) {
  const PAGE_SIZE = 4; // Page size should be consistent with the pagination

  const from = (page - 1) * PAGE_SIZE;
  const to = page * PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("customer")
    .select("*, name", { count: "exact" })
    .range(from, to);

  if (error) {
    console.log("Error fetching customer:", error.message);
    throw new Error("Customers could not be loaded");
  }

  return { data, count }; // Return both data and count
}

// Delete a customer from the 'customer' table by ID
export async function deleteCustomer(id) {
  const { data, error } = await supabase.from("customer").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Customer could not be deleted");
  }

  return data;
}

// Create a new customer in the 'customer' table
export async function createCustomer(newCustomer) {
  const { data, error } = await supabase
    .from("customer")
    .insert([newCustomer])
    .select();

  if (error) {
    console.log("Error creating customer:", error);
    throw new Error(`Customer could not be created: ${error.message}`);
  }

  return data;
}
/* EDIT */
export async function editCustomer({ id, ...updates }) {
  if (!id || Object.keys(updates).length === 0) {
    throw new Error("ID and updates are required");
  }

  const { data, error } = await supabase
    .from("customer")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.log("Error editing customer:", error);
    throw new Error("Customer could not be edited");
  }

  return data;
}
