// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eagehoupvhabgkwafpnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZ2Vob3VwdmhhYmdrd2FmcG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3NDE2OTksImV4cCI6MjA0MjMxNzY5OX0.AqRenuRNsJb-32CBXo9Hetolg5BaPENUgYPpXK79eUc';
export const supabase = createClient(supabaseUrl, supabaseKey);
