import { NextRequest, NextResponse } from 'next/server';
import DBconnect from '../../../../lib/db';
import User from '../../../../lib/Models/User';

export const POST = async (req: Request) => {
    try {
        await DBconnect();

        const { firstName, lastName, mobileNumber, email, confirmPassword, userType } = await req.json();

        const password = confirmPassword;

        const newUser = { firstName, lastName, mobileNumber, email, password, userType };

        const user = await User.findOne(email, mobileNumber);

    if (!user) {
      return NextResponse.json(
        { error: "User exist. Please login" },
        { status: 401 }
      );
    }

        const createUser = await User.create(newUser);

        return NextResponse.json({ createUser }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Failed to save body." },
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