import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dvilmtuxaarzsskeboue.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aWxtdHV4YWFyenNza2Vib3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NTMwNzAsImV4cCI6MjA1MjQyOTA3MH0.qjeJ5sC4-tqq5PCGXnX_EunyxsFZQ5ZmJU56hD5f-6Y";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
