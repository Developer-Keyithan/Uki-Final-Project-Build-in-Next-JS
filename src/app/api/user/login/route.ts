import { NextRequest, NextResponse } from "next/server";
import User from "../../../../../lib/Models/User";
import DBconnect from "../../../../../lib/db";
import bcrypt from 'bcrypt';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { emailOrMobileNumber, password } = body;

    if (!emailOrMobileNumber) {
      return NextResponse.json(
        { error: "Please enter your e-mail or mobile number" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Please enter the password" },
        { status: 400 }
      );
    }

    const isMobileNumber = /^\d+$/.test(emailOrMobileNumber);
    const query = isMobileNumber
      ? { mobileNumber: emailOrMobileNumber }
      : { email: emailOrMobileNumber };

    await DBconnect();

    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password! Please enter correct password" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Account loged in successfully!", user: { id: user._id, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
