'use server'

import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/utils/roles'

type ActionState = {
    message: string
    error: boolean
}

export async function createActivity(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { message: 'Unauthorized', error: true }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!isAdmin(profile?.role)) {
        return { message: 'Only admins can create activities', error: true }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const status = formData.get('status') as string
    const leadIds = formData.getAll('leads') as string[]

    if (!title || !date) {
        return { message: 'Title and date are required', error: true }
    }

    // Create activity
    const { data: activity, error: activityError } = await supabaseAdmin
        .from('activities')
        .insert({
            title,
            description,
            date,
            status,
            created_by: user.id
        })
        .select()
        .single()

    if (activityError || !activity) {
        return { message: activityError?.message || 'Failed to create activity', error: true }
    }

    // Insert leads if any
    if (leadIds.length > 0) {
        const leadsData = leadIds.map(userId => ({
            activity_id: activity.id,
            user_id: userId
        }))

        const { error: leadsError } = await supabaseAdmin
            .from('activity_leads')
            .insert(leadsData)

        if (leadsError) {
            return { message: 'Activity created but failed to assign leads', error: true }
        }
    }

    revalidatePath('/dashboard/activities')
    return { message: 'Activity created successfully', error: false }
}

export async function getActivities(statusFilter?: 'upcoming' | 'done') {
    const supabase = createClient()

    let query = supabase
        .from('activities')
        .select(`
            *,
            activity_leads (
                user_id,
                profiles:user_id (
                    id,
                    full_name,
                    email
                )
            )
        `)
        .order('date', { ascending: true })

    if (statusFilter) {
        query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching activities:', error)
        return []
    }

    return data || []
}
