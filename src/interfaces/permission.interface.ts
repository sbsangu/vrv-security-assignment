export const ROLE_PERMISSIONS = {
    ADMIN: [
        { resource: 'users', actions: ['read', 'write', 'delete'] },
        { resource: 'roles', actions: ['read', 'write', 'delete'] }
    ],
    MODERATOR: [
        { resource: 'users', actions: ['read'] },
        { resource: 'posts', actions: ['moderate'] }
    ],
    USER: [
        { resource: 'profile', actions: ['read', 'update'] }
    ]
};