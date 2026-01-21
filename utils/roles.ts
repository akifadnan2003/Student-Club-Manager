export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MEMBER: 'member',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export function isSuperAdmin(role?: string | null) {
    return role === ROLES.SUPER_ADMIN;
}

export function isAdmin(role?: string | null) {
    return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

export const ROLE_LABELS = {
    [ROLES.SUPER_ADMIN]: 'General Secretary',
    [ROLES.ADMIN]: 'Admin Team',
    [ROLES.MEMBER]: 'Member',
};
