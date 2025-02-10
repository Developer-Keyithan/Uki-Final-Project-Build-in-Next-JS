import { NextResponse } from 'next/server';
import DBconnect from '../../../../../lib/db';
import Product from '../../../../../lib/Models/Product';

export const GET = async () => {
    try {
        await DBconnect();
        const products = await Product.find()

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch all products data." }, { status: 500 });
    }
}