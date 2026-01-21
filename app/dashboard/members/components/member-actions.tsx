'use client'

import { useState } from "react";
import { Key, Shield, Trash2, X, Loader2, AlertTriangle } from "lucide-react";
import { deleteMember, resetMemberPassword, updateMemberRole } from "@/app/actions/super-admin";
import { cn } from "@/utils/cn";
import { ROLES, ROLE_LABELS } from "@/utils/roles";

type MemberActionsProps = {
    memberId: string
    memberName: string | null
    currentRole: string
}

export function MemberActions({ memberId, memberName, currentRole }: MemberActionsProps) {
    const [openDialog, setOpenDialog] = useState<'delete' | 'password' | 'role' | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

    const closeDialog = () => {
        setOpenDialog(null);
        setMessage(null);
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        const result = await deleteMember(memberId);
        if (result.error) {
            setMessage({ text: result.message, error: true });
            setLoading(false);
        } else {
            closeDialog();
        }
    };

    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;

        const result = await resetMemberPassword(memberId, password);
        setMessage({ text: result.message, error: result.error });
        setLoading(false);

        if (!result.error) {
            setTimeout(closeDialog, 1500);
        }
    };

    const handleRoleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const role = formData.get('role') as string;

        const result = await updateMemberRole(memberId, role);
        setMessage({ text: result.message, error: result.error });
        setLoading(false);

        if (!result.error) {
            setTimeout(closeDialog, 1500);
        }
    };

    const name = memberName || 'this user';

    return (
        <>
            <div className="flex justify-end gap-3">
                <button
                    onClick={() => setOpenDialog('password')}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Change Password"
                >
                    <Key className="h-4 w-4" />
                </button>
                <button
                    onClick={() => setOpenDialog('role')}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Change Role"
                >
                    <Shield className="h-4 w-4" />
                </button>
                <button
                    onClick={() => setOpenDialog('delete')}
                    className="text-ulu-red hover:text-red-400 transition-colors"
                    title="Delete User"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Dialog Overlay */}
            {openDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-ulu-surface border border-[#333] rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#222]">
                            <h3 className="font-semibold text-white">
                                {openDialog === 'delete' && 'Delete User'}
                                {openDialog === 'password' && 'Reset Password'}
                                {openDialog === 'role' && 'Update Role'}
                            </h3>
                            <button onClick={closeDialog} className="text-gray-400 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {message && (
                                <div className={cn(
                                    "mb-4 p-3 rounded-lg text-sm text-center font-medium",
                                    message.error ? "bg-red-900/30 text-red-400 border border-red-900/50" : "bg-green-900/30 text-green-400 border border-green-900/50"
                                )}>
                                    {message.text}
                                </div>
                            )}

                            {/* DELETE DIALOG */}
                            {openDialog === 'delete' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-ulu-red bg-red-900/10 p-3 rounded-lg border border-red-900/20">
                                        <AlertTriangle className="h-5 w-5 shrink-0" />
                                        <p className="text-sm">Are you sure you want to delete <strong>{name}</strong>? This cannot be undone.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={closeDialog} className="flex-1 px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444]">Cancel</button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={loading}
                                            className="flex-1 px-4 py-2 bg-ulu-red text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex justify-center"
                                        >
                                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PASSWORD RESET DIALOG */}
                            {openDialog === 'password' && (
                                <form onSubmit={handlePasswordReset} className="space-y-4">
                                    <p className="text-sm text-ulu-text-secondary">Set a new password for <strong>{name}</strong>.</p>
                                    <input
                                        name="password"
                                        type="text"
                                        required
                                        minLength={6}
                                        className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-lg text-white"
                                        placeholder="New Password"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full px-4 py-2 bg-ulu-blue text-white rounded-lg hover:bg-ulu-blue/90 disabled:opacity-50 flex justify-center"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
                                    </button>
                                </form>
                            )}

                            {/* UPDATE ROLE DIALOG */}
                            {openDialog === 'role' && (
                                <form onSubmit={handleRoleUpdate} className="space-y-4">
                                    <p className="text-sm text-ulu-text-secondary">Select a new role for <strong>{name}</strong>.</p>
                                    <select
                                        name="role"
                                        defaultValue={currentRole}
                                        className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-lg text-white"
                                    >
                                        <option value={ROLES.MEMBER}>{ROLE_LABELS[ROLES.MEMBER]}</option>
                                        <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</option>
                                        <option value={ROLES.SUPER_ADMIN}>{ROLE_LABELS[ROLES.SUPER_ADMIN]}</option>
                                    </select>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full px-4 py-2 bg-ulu-blue text-white rounded-lg hover:bg-ulu-blue/90 disabled:opacity-50 flex justify-center"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Role"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
