import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Provider } from '@/types'
import ProfileForm from './profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!provider) redirect('/dashboard')

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit profile</h1>
      <ProfileForm provider={provider as Provider} />
    </div>
  )
}
