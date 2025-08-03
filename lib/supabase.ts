import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxzieezklzehlhizphkj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4emllZXprbHplaGxoaXpwa2oiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDU2NzIwMCwiZXhwIjoyMDUwMTQzMjAwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 