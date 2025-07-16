import { supabase } from '@/supabaseClient'
import { removeSelectedKin } from '@/app/lib/kinCookies'

export const kinLogout = async () => {
  try {
    await supabase.auth.signOut()

    removeSelectedKin();

    window.location.href = '/login'
  } catch (error) {
    console.error('Error during logout:', error)
  }
}
