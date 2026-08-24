import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase.js'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null)
  const profile = ref(null)

  async function _fetchProfile(user_uuid) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_uuid', user_uuid)
      .single()
    profile.value = data
  }

  async function _createProfile(user_uuid, uname, email) {
    const { data } = await supabase
      .from('profiles')
      .insert({ user_uuid, username: uname, email })
  }

  async function init() {
    const { data } = await supabase.auth.getSession()

    session.value = data.session
    // console.log(data.session)
    if (data.session?.user) await _fetchProfile(data.session.user.id)
  }

  async function register({ uname, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: uname, display_name: uname } },
    })
    if (error) return { ok: false, error: error.message }
    if (!data.session) {
      return {
        ok: false,
        error: 'Error in creating account. Please check with administrator',
      }
    }
    session.value = data.session
    await _createProfile(data.session.user.id, uname, email)
    return { ok: true }
  }

  async function login({ identifier, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    })
    if (error) return { ok: false, error: error.message }

    session.value = data.session
    if (data.session?.user) await _fetchProfile(data.session.user.id)
    return { ok: true }
  }

  async function logout() {
    await supabase.auth.signOut()
    session.value = null
    profile.value = null
  }

  return {
    session, profile,
    init, register, login, logout,
  }
})
