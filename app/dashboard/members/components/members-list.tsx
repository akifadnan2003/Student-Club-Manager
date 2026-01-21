import { format } from "date-fns";
import { User, Shield, CheckCircle2 } from "lucide-react";
import { isSuperAdmin, ROLES } from "@/utils/roles";
import { MemberActions } from "./member-actions";

type Profile = {
    id: string
    full_name: string | null
    email: string
    role: string
    created_at: string
}

export function MembersList({ members, currentUserRole }: { members: Profile[], currentUserRole: string }) {
    if (members.length === 0) {
        return (
            <div className="text-center py-12 bg-ulu-surface rounded-lg border border-[#333]">
                <div className="mx-auto h-12 w-12 text-gray-600">
                    <User className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-sm font-semibold text-white">No members found</h3>
                <p className="mt-1 text-sm text-ulu-text-secondary">Get started by creating a new member.</p>
            </div>
        );
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case ROLES.SUPER_ADMIN:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ulu-gold/20 px-2 py-1 text-xs font-medium text-ulu-gold ring-1 ring-inset ring-ulu-gold/30">
                        <Shield className="h-3 w-3" /> Gen Sec
                    </span>
                );
            case ROLES.ADMIN:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ulu-cyan/20 px-2 py-1 text-xs font-medium text-ulu-cyan ring-1 ring-inset ring-ulu-cyan/30">
                        <CheckCircle2 className="h-3 w-3" /> Admin Team
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-white/20">
                        <User className="h-3 w-3" /> Member
                    </span>
                );
        }
    };

    return (
        <div className="space-y-4">
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 md:hidden gap-4">
                {members.map((member) => (
                    <div key={member.id} className="bg-ulu-surface p-4 rounded-lg border border-[#333] shadow-sm flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-ulu-blue/20 flex items-center justify-center text-ulu-blue font-bold text-lg">
                            {member.full_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm font-semibold text-white truncate">{member.full_name || 'Unknown'}</h3>
                                {getRoleBadge(member.role)}
                            </div>
                            <p className="text-sm text-ulu-text-secondary truncate">{member.email}</p>
                            <div className="mt-2 text-xs text-justify-gray-500">
                                Joined {format(new Date(member.created_at), 'MMM d, yyyy')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-ulu-surface rounded-lg border border-[#333] overflow-hidden">
                <table className="min-w-full divide-y divide-[#333]">
                    <thead className="bg-[#222]">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Member</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-ulu-surface divide-y divide-[#333]">
                        {members.map((member) => (
                            <tr key={member.id} className="hover:bg-[#333]/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-ulu-blue/20 flex items-center justify-center text-ulu-blue font-bold">
                                                {member.full_name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white">{member.full_name || 'Unknown'}</div>
                                            <div className="text-sm text-ulu-text-secondary">{member.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getRoleBadge(member.role)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-ulu-text-secondary">
                                    {format(new Date(member.created_at), 'MMM d, yyyy')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {isSuperAdmin(currentUserRole) && (
                                        <MemberActions
                                            memberId={member.id}
                                            memberName={member.full_name}
                                            currentRole={member.role}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
