import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../interfaces/user.interface';

export interface IRole extends Document {
    name: UserRole;
    permissions: string[];
    description: string;
}

const RoleSchema= new Schema<IRole>({
    name: { 
        type: String, 
        enum: Object.values(UserRole), 
        required: true, 
        unique: true 
    },
    permissions: [{ 
        type: String, 
        required: true 
    }],
    description: { 
        type: String, 
        required: true 
    }
});

export const Role = mongoose.model<IRole>('Role', RoleSchema);