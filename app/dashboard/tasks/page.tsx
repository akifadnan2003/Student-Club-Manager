import { createClient } from "@/utils/supabase/server";
import { CreateTaskDialog } from "./components/create-task-dialog";
import { TasksTabs } from "./components/tasks-tabs";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

import { isAdmin } from "@/utils/roles";

export default async function TasksPage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // 1. Get User Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

    const role = profile?.role || 'member';
    const isUserAdmin = isAdmin(role);

    // 2. Fetch Data
    let tasksQuery = supabase
        .from('tasks')
        .select(`
        *,
        assignee:profiles!assigned_to(full_name),
        creator:profiles!created_by(full_name)
    `)
        .order('created_at', { ascending: false });

    // Admins see all tasks, Members see only assigned tasks
    if (!isUserAdmin) {
        tasksQuery = tasksQuery.eq('assigned_to', user.id);
    }

    const { data: tasks } = await tasksQuery;

    // Fetch members for assignment (only needed for Admin+)
    let members: { id: string, full_name: string | null }[] = [];
    if (isUserAdmin) {
        const { data: allMembers } = await supabase.from('profiles').select('id, full_name');
        members = allMembers || [];
    }

    // Define proper task type
    type Task = {
        id: string
        title: string
        description: string | null
        status: 'pending' | 'submitted' | 'verified'
        created_at: string
        assignee: { full_name: string | null } | null
        creator: { full_name: string | null } | null
    }

    // Cast tasks to ensure types (Supabase types can be loose initially)
    const typedTasks: Task[] = (tasks || []).map(t => ({
        ...t,
        // Ensure relations are objects not arrays
        assignee: Array.isArray(t.assignee) ? t.assignee[0] : t.assignee,
        creator: Array.isArray(t.creator) ? t.creator[0] : t.creator,
    }));

    const pendingTasks = typedTasks.filter(t => t.status === 'pending');
    const submittedTasks = typedTasks.filter(t => t.status === 'submitted');
    const verifiedTasks = typedTasks.filter(t => t.status === 'verified');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Task Management</h1>
                    <p className="text-ulu-text-secondary text-sm mt-1">
                        {isUserAdmin ? 'Create, assign, and verify tasks' : 'View and submit your assigned tasks'}
                    </p>
                </div>
                {isUserAdmin && <CreateTaskDialog members={members} />}
            </div>

            <TasksTabs
                pending={pendingTasks}
                submitted={submittedTasks}
                verified={verifiedTasks}
                userRole={role}
            />
        </div>
    );
}
