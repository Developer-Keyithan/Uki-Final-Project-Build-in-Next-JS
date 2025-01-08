import { Schema, model, models } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        mobileNumber: { type: Number, required: true, unique: true },
        password: { type: String, required: true },
        userType: { type: String, required: true },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const userModel = models.User || model('User', userSchema);

export default userModel;
