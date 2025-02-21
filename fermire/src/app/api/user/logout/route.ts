import { NextResponse } from 'next/server';

export const POST = async () => {
    try {
        const response = NextResponse.json({ message: 'Logout successful' });

        response.cookies.set('token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json({ error: 'Server error', details: (error as Error).message }, { status: 500 });
    }
};