'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/utils/roles'

type FormState = {
    message: string
    error: boolean
} | null

export async function createTask(prevState: FormState, formData: FormData) {
    const supabase = createClient()

    // 1. Verify Auth & Role (Admins only)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: 'Unauthorized', error: true }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!isAdmin(profile?.role)) {
        return { message: 'Only Admins can create tasks', error: true }
    }

    // 2. Extract Data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const assignedTo = formData.get('assignedTo') as string

    if (!title || !assignedTo) {
        return { message: 'Title and Assignee are required', error: true }
    }

    // 3. Insert Task
    const { error } = await supabase
        .from('tasks')
        .insert({
            title,
            description,
            assigned_to: assignedTo,
            created_by: user.id,
            status: 'pending'
        })

    if (error) {
        return { message: 'Failed to create task: ' + error.message, error: true }
    }

    revalidatePath('/dashboard/tasks')
    return { message: 'Task created successfully', error: false }
}

export async function submitTask(formData: FormData) {
    const supabase = createClient()
    const taskId = formData.get('taskId') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: 'Unauthorized', error: true }

    // Update status to 'submitted'
    // RLS policies should ensure only assignee or admin can do this.
    const { error } = await supabase
        .from('tasks')
        .update({ status: 'submitted', updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .eq('assigned_to', user.id) // Ensure only assignee can submit

    if (error) {
        return { message: 'Failed to submit task', error: true }
    }

    revalidatePath('/dashboard/tasks')
    return { message: 'Task submitted', error: false }
}

export async function verifyTask(formData: FormData) {
    const supabase = createClient()
    const taskId = formData.get('taskId') as string
    const status = formData.get('status') as string // 'verified' or 'pending' (reject)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: 'Unauthorized', error: true }

    // Check if admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!isAdmin(profile?.role)) {
        return { message: 'Only Admins can verify tasks', error: true }
    }

    const { error } = await supabase
        .from('tasks')
        .update({ status: status, updated_at: new Date().toISOString() })
        .eq('id', taskId)

    if (error) {
        return { message: 'Failed to update task', error: true }
    }

    revalidatePath('/dashboard/tasks')
    return { message: 'Task updated', error: false }
}
