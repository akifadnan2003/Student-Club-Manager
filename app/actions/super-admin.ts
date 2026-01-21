'use server'

import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { isSuperAdmin } from '@/utils/roles'

type ActionState = {
    message: string
    error: boolean
}

// Helper to verify Super Admin status
async function verifySuperAdmin() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return isSuperAdmin(profile?.role)
}

export async function deleteMember(userId: string): Promise<ActionState> {
    const isAllowed = await verifySuperAdmin()
    if (!isAllowed) return { message: 'Unauthorized', error: true }

    // Delete from Auth (Cascade should handle profile, but we can be explicit)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
        return { message: error.message, error: true }
    }

    // Explicitly delete profile if cascade didn't (safety)
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId)

    revalidatePath('/dashboard/members')
    return { message: 'User deleted successfully', error: false }
}

export async function resetMemberPassword(userId: string, newPassword: string): Promise<ActionState> {
    const isAllowed = await verifySuperAdmin()
    if (!isAllowed) return { message: 'Unauthorized', error: true }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword
    })

    if (error) {
        return { message: error.message, error: true }
    }

    return { message: 'Password reset successfully', error: false }
}

export async function updateMemberRole(userId: string, newRole: string): Promise<ActionState> {
    const isAllowed = await verifySuperAdmin()
    if (!isAllowed) return { message: 'Unauthorized', error: true }

    // Validate role
    if (!['super_admin', 'admin', 'member'].includes(newRole)) {
        return { message: 'Invalid role', error: true }
    }

    const { error } = await supabaseAdmin
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    if (error) {
        return { message: error.message, error: true }
    }

    revalidatePath('/dashboard/members')
    return { message: 'Role updated successfully', error: false }
}
