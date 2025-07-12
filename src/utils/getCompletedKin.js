import { supabase } from '@/supabaseClient'

export const getCompletedKin = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.error('Authentication failed in getCompletedKinProfilesFromDB')
    return []
  }

  const { data: kinProfiles, error: fetchError } = await supabase
    .from('kin')
    .select('id, name, role, gender, dob, pin, callsign, status')
    .eq('kindred_id', user.id)
    .eq('status', true)

  if (fetchError) {
    console.error('Error fetching completed kin profiles:', fetchError)
    return []
  }

  return kinProfiles
}
