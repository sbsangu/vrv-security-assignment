import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { Logger } from '../utils/logger.util';

export class UserRepository {
    private logger: Logger;

    constructor() {
        this.logger = new Logger('UserRepository');
    }

    async findByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ email });
            return user ? {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                password: user.password
            } : null;
        } catch (error) {
            this.logger.error('Error finding user by email', error);
            throw error;
        }
    }

    async findById(id: string): Promise<IUser | null> {
        try {
            const user = await User.findById(id);
            return user ? {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                password: ''
            } : null;
        } catch (error) {
            this.logger.error('Error finding user by ID', error);
            throw error;
        }
    }

    async create(userData: IUser): Promise<IUser> {
        try {
            const newUser = new User(userData);
            await newUser.save();

            return {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                password: ''
            };
        } catch (error) {
            this.logger.error('Error creating user', error);
            throw error;
        }
    }
}

export default new UserRepository();