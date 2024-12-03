export const extractPermissions = (user) => {
    const allPermissions = [
        ...user.Permissions.map((p) => p.Name),
        ...user.Role.Permissions.map((p) => p.Name),
    ]
    return [...new Set(allPermissions)]
}
