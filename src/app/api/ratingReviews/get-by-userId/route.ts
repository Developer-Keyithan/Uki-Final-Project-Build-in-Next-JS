import { NextRequest, NextResponse } from "next/server";
import DBconnect from "../../../../../lib/db";
import RatingReviews from "../../../../../lib/Models/ReviewRating";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId || typeof userId !== 'string') {
            return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
        }

        await DBconnect();

        const userRatingReviews = await RatingReviews.find({ userId }).populate({
            path: 'productId',
            select: 'productName productImages imageUrl productDescription'
        });

        if (!userRatingReviews.length) {
            return NextResponse.json(
                { message: "No rating and review found for this user" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Rating and review retrieved successfully",
                userRatingReviews
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error retrieving rating and review:", error);

        return NextResponse.json(
            { message: "Error retrieving rating and review", error: error.message },
            { status: 500 }
        );
    }
};