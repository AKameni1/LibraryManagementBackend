import { getSignedImageUrl } from '../services/s3Service.js'
import { extractPermissions } from './extractPermissions.js'

export const formatUserData = async (user) => ({
    id: user.UserID,
    email: user.Email,
    name: user.Username,
    active: user.IsActive,
    role: {
        roleId: user.Role.RoleID,
        name: user.Role.Name,
        description: user.Role.Description,
    },
    permissions: extractPermissions(user),
    profileImageUrl: await getSignedImageUrl(user.ProfileImage),
})
