import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fqmpeequpjrflylnzdvc.supabase.co"; // שימי את ה-URL שלך
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxbXBlZXF1cGpyZmx5bG56ZHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1OTc0NDIsImV4cCI6MjA2MzE3MzQ0Mn0.2OwaK-T0kC64ljIS7TewOR5aCHvtVUXE_KC7shSosiE"; // שימי את המפתח מ-Supabase

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
