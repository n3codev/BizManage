import supabase from "./supabase";

export async function getInvoice(page = 1) {
  const PAGE_SIZE = 4;

  const from = (page - 1) * PAGE_SIZE;
  const to = page * PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("invoices")
    .select(
      `
      *,
      customer:customer(name),
      seller:seller(companyName)
    `,
      { count: "exact" }
    )
    .range(from, to);

  if (error) {
    console.log("Error fetching invoices:", error.message);
    throw new Error("Invoices could not be loaded");
  }

  return { data, count };
}

export async function deleteInvoices(id) {
  const { data, error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) {
    console.log("Error deleting invoice:", error);
    throw new Error("Invoice could not be deleted");
  }

  return data;
}

export async function createInvoices(newInvoices) {
  const { data, error } = await supabase
    .from("invoices")
    .insert([newInvoices])
    .select();

  if (error) {
    throw new Error("Invoice could not be created");
  }

  return data;
}

/* EDIT  */
export async function editInvoices({ id, ...updates }) {
  if (!id || Object.keys(updates).length === 0) {
    throw new Error("ID and updates are required");
  }

  const validUpdates = (({ amount, date, sellerId, customerId }) => ({
    amount,
    date,
    sellerId,
    customerId,
  }))(updates);

  const { data, error } = await supabase
    .from("invoices")
    .update(validUpdates)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error("Invoice could not be edited");
  }

  return data;
}
