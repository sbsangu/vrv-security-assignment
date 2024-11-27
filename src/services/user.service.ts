
import { User } from '../models/user.model';
import { IUser, UserRole } from '../interfaces/user.interface';
import { Logger } from '../utils/logger.util';

export class UserService {
    private logger: Logger;

    constructor() {
        this.logger = new Logger('UserService');
    }

    async getAllUsers(role?: UserRole): Promise<IUser[]> {
        try {
            const query = role ? { role } : {};
            const users = await User.find(query).select('-password');
            return users.map(user => ({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }));
        } catch (error) {
            this.logger.error('Error fetching users', error);
            throw error;
        }
    }

    async getUserById(userId: string): Promise<IUser | null> {
        try {
            const user = await User.findById(userId).select('-password');
            return user ? {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                password: ''
            } : null;
        } catch (error) {
            this.logger.error('Error fetching user by ID', error);
            throw error;
        }
    }

    async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId, 
                updateData, 
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                password: ''
            };
        } catch (error) {
            this.logger.error('Error updating user', error);
            throw error;
        }
    }

    async deleteUser(userId: string): Promise<void> {
        try {
            const result = await User.findByIdAndDelete(userId);
            if (!result) {
                throw new Error('User not found');
            }
        } catch (error) {
            this.logger.error('Error deleting user', error);
            throw error;
        }
    }
}

export default new UserService();