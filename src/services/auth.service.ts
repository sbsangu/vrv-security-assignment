import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { IUser, UserRole } from '../interfaces/user.interface';
import configuration from '../config/serverConfig';
import { Logger } from '../utils/logger.util';

export class AuthService {
    private logger: Logger;

    constructor() {
        this.logger = new Logger('AuthService');
    }

    async register(userData: IUser): Promise<IUser> {
        try {
            const existingUser = await User.findOne({ 
                $or: [
                    { email: userData.email },
                    { username: userData.username }
                ]
            });

            if (existingUser) {
                throw new Error('User already exists');
            }

            const newUser = new User({
                ...userData,
                role: userData.role || UserRole.USER
            });

            await newUser.save();

            
            return this.sanitizeUser(newUser);
        } catch (error) {
            this.logger.error('Registration error', error);
            throw error;
        }
    }

    async login(email: string, password: string): Promise<{ user: IUser, token: string }> {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            const token = this.generateToken(user);

            return { 
                user,
                token 
            };
        } catch (error) {
            this.logger.error('Login error', error);
            throw error;
        }
    }

    private generateToken(user: any): string {
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        const secretKey = configuration.JWT_SECRET_KEY || "default-secret-key";
        return jwt.sign(
            payload,
            secretKey,
            { expiresIn: '1d' }
        );
        
    }

    //sanitizing the user
    private sanitizeUser(user: any): IUser {
        const { _id, username, email, role } = user;
        return { 
            id: _id, 
            username, 
            email, 
            password: '', 
            role 
        };
    }
}

export default new AuthService();