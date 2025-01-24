import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();

    const token = cookieStore.get('token');

    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        )
    }

    const  { value } = token;
    const SECRET_KEY = process.env.SECRET_KEY;

    console.log(value);

    try {
        verify(value, SECRET_KEY!);

        return NextResponse.json({ message: 'Authorized user' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
    }

    console.log(token);
}

