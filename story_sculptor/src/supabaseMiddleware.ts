import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!;

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcnR2dnJ4aXBla3ZleWdoZ3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1NTQyNDcsImV4cCI6MjAzNTEzMDI0N30.iSYldNBVqsOQB9EQEvpylwHKoyHdiboXsKnI5jLxojI"


interface SupabaseConnection {
  client: SupabaseClient | null;
  promise: Promise<SupabaseClient> | null;
}

let cached: SupabaseConnection = (global as any).supabase;

if (!cached) {
  cached = (global as any).supabase = {
    client: null, promise: null
  };
}

export const connectToDatabase = async (): Promise<SupabaseClient> => {
  if (cached.client) return cached.client;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY');
  }

  if (!cached.promise) {
    cached.promise = new Promise((resolve, reject) => {
      try {
        const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        resolve(client);
      } catch (error) {
        reject(error);
      }
    });
  }

  cached.client = await cached.promise;
  console.log("Here program flow went");

  return cached.client;
};
