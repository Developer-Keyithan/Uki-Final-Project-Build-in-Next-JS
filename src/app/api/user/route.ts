import { NextRequest, NextResponse } from 'next/server';
import DBconnect from '../../../../lib/db';
import User from '../../../../lib/Models/User';

export const POST = async (req: Request) => {
    try {
        await DBconnect();

        const { firstName, lastName, mobileNumber, email, confirmPassword, userType } = await req.json();

        const password = confirmPassword;

        const newUser = { firstName, lastName, mobileNumber, email, password, userType };

        const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });

        if (existingUser) {
            return NextResponse.json(
                { error: "Account already exist! Please login." },
                { status: 401 }
            );
        }

        await User.create(newUser);

        return NextResponse.json({ message: "User account successfully created!" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Sorry! Failed to create user account." },
            { status: 500 }
        );
    }
};

export const GET = async () => {
    try {
        await DBconnect();
        const body = await User.find();

        return NextResponse.json(body, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch user data." }, { status: 500 });
    }
};