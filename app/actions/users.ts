'use server'

import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { isSuperAdmin } from '@/utils/roles'


type FormState = {
    message: string
    error: boolean
} | null

export async function createUser(prevState: FormState, formData: FormData) {
    const supabase = createClient()

    // 1. Verify current user is Super Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { message: 'Unauthorized', error: true }
    }

    // Check role in profiles
    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!isSuperAdmin(currentUserProfile?.role)) {
        return { message: 'Unauthorized: Only General Secretary can create users', error: true }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as string

    if (!email || !password || !fullName || !role) {
        return { message: 'Missing fields', error: true }
    }

    // 2. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
    })

    if (authError || !authData.user) {
        return { message: authError?.message || 'Failed to create auth user', error: true }
    }

    // 3. Create Profile
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            role
        })

    if (profileError) {
        // Optional: Cleanup auth user if profile creation fails?
        // await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        return { message: 'Failed to create profile: ' + profileError.message, error: true }
    }

    revalidatePath('/members')
    return { message: 'User created successfully', error: false }
}
