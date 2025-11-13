import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ladotprpkuhgfmlljwiv.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZG90cHJwa3VoZ2ZtbGxqd2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzE2MjcsImV4cCI6MjA3ODI0NzYyN30.GFkehXSVmNLO1B4ZhhJwHg7rXAkjg8jBRYx5IBMD7c0' 

export default createClient(supabaseUrl, supabaseAnonKey)