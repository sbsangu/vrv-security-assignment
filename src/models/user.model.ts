import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';

export interface IUserModel extends Document {
    _id:string
    username: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    comparePassword(userPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserModel>({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: Object.values(UserRole), 
        default: UserRole.USER 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});


UserSchema.pre<IUserModel>('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as mongoose.CallbackError);
    }
});


UserSchema.methods.comparePassword = async function(
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUserModel>('User', UserSchema);