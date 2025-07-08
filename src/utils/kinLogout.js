// utils/logoutKin.js
import { supabase } from '@/supabaseClient'

export const kinLogout = async () => {
  try {
    await supabase.auth.signOut()

    document.cookie = 'selectedKin=; Max-Age=0; Path=/'

    window.location.href = '/login'
  } catch (error) {
    console.error('Error during logout:', error)
  }
}
