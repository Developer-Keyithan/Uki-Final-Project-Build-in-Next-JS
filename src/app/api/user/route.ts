import { NextRequest, NextResponse } from 'next/server';
import DBconnect from '../../../../lib/db';
import User from '../../../../lib/Models/User';

export const POST = async (req: Request) => {
    try {
        await DBconnect();

        const { firstName, lastName, mobileNumber, confirmPassword, userType} = await req.json();

        const password = confirmPassword;

        const newUser = { firstName, lastName, mobileNumber, password, userType};
        
        console.log("User to save:", newUser);

        const createUser = await User.insertMany(newUser);

        return NextResponse.json({ createUser }, { status: 200 });
    } catch (error: any) {
        console.error("Error saving body:", error.message);
        return NextResponse.json(
            { message: "Failed to save body.", error: error.message },
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
        console.error("Error fetching body:", error);

        return NextResponse.json({ message: "Failed to fetch body." }, { status: 500 });
    }
};