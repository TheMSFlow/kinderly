'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/supabaseClient'
import { getSelectedKin } from '@/app/lib/kinCookies'

const SelectedKinContext = createContext(null)

export const SelectedKinProvider = ({ children }) => {
  const [kin, setKin] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch from Supabase using kin.id
  const fetchKinFromSupabase = useCallback(async () => {
    const storedKin = getSelectedKin()
    if (!storedKin?.id) {
      setKin(null)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('kin')
      .select('*')
      .eq('id', storedKin.id)
      .single()

    if (error) {
      console.error('Error fetching kin:', error)
      setKin(null)
    } else {
      setKin(data)
    }
    setLoading(false)
  }, [])

  // Trigger fetch on first mount
  useEffect(() => {
    fetchKinFromSupabase()
  }, [fetchKinFromSupabase])

  // Listen to cookie changes via storage events (triggered by set/removeSelectedKin)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'kinListener') {
        fetchKinFromSupabase()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [fetchKinFromSupabase])

  return (
    <SelectedKinContext.Provider value={{ kin, loading }}>
      {children}
    </SelectedKinContext.Provider>
  )
}

export const useSelectedKin = () => useContext(SelectedKinContext)
