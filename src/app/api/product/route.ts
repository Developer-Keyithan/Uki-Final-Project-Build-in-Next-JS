import { NextRequest, NextResponse } from 'next/server';
import DBconnect from '../../../../lib/db';
import Product from '../../../../lib/Models/Product';
import { Types } from 'mongoose';
import User from '../../../../lib/Models/User';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const {
            userId,
            ProductImage,
            productName,
            productDescription,
            price,
            categories,
            harvestingDate,
            agricationMethod,
            stockValue,
            unit
        } = body.newProduct;

        if (!ProductImage) {
            return NextResponse.json(
                { message: "At least one product image is required" },
                { status: 400 }
            );
        }

        await DBconnect();

        const newProduct = new Product({
            userId: new Types.ObjectId(userId),
            productImages: [
                { imageUrl: ProductImage }
            ],
            productName,
            productDescription,
            price: {
                newPrice: price
            },
            categories,
            harvestingDate,
            agricationMethod,
            stock: {
                value: stockValue,
                unit: unit
            },
            isItAllowedToBeRecommend: true,
            freeDelivery: false
        });

        await newProduct.save();

        return NextResponse.json({
            message: "Product added successfully",
            product: newProduct
        }, { status: 201 });

    } catch (error: any) {
        console.log("Error adding product:", error);

        return NextResponse.json({
            message: "Error adding product",
            error: error.message
        }, { status: 500 });
    }
};


export const GET = async () => {
    try {
        await DBconnect();
        const products = await Product.find({ isItAllowedToBeRecommend: true })
            .sort({ updatedAt: -1 });

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch all products data." }, { status: 500 });
    }
};

export const PATCH = async (req: NextRequest) => {
    try {
        const { userId, productId, productImages, price, productName, productDescription, categories, harvestingDate, agricationMethod, isItAllowedToBeRecommend, freeDelivery } = await req.json();
        await DBconnect();
        console.log(userId)
        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Check user role
        const user = await User.findById(userId); // Assuming a User model exists
        const isAdmin = user && (user.userType === "admin" || user.userType === "super-admin");
        const isSeller = user && user.userType === "seller";

        // Validate the isBlockedByAdmin and isItAllowedToBeRecommend logic
        if (isItAllowedToBeRecommend === true) {
            if (product.isBlockedByAdmin === true) {
                if (isAdmin) {
                    // Admin can unblock and allow recommendation
                    product.isBlockedByAdmin = false;
                    product.isItAllowedToBeRecommend = true;
                } else {
                    return NextResponse.json({ message: "This product has been blocked by the administration. The platform has notified the administration of this request." }, { status: 403 });
                }
            } else {
                // If isBlockedByAdmin is false, only the seller can update the recommendation
                if (isSeller) {
                    product.isItAllowedToBeRecommend = true;
                    product.isBlockedByAdmin = false; // No change needed if it's already false
                } else {
                    return NextResponse.json({ message: "Only the seller can allow the recommendation for non-blocked products." }, { status: 403 });
                }
            }
        }

        // If trying to disable recommendation
        if (isItAllowedToBeRecommend === false) {
            if (product.isBlockedByAdmin === true) {
                return NextResponse.json({ message: "This product recommendation is already stopped by the platform." }, { status: 400 });
            } else {
                if (isAdmin) {
                    product.isItAllowedToBeRecommend = false;
                    product.isBlockedByAdmin = true; // Admin can block the product
                } else {
                    product.isItAllowedToBeRecommend = false;
                    product.isBlockedByAdmin = false
                    // return NextResponse.json({ message: "Only the platform (admin) can stop recommendation for non-blocked products." }, { status: 403 });
                }
            }
        }

        // Update other product fields
        if (price && product.price.newPrice !== price) {
            product.price.oldPrice = product.price.newPrice;
            product.price.newPrice = price;
        }

        if (productName) product.productName = productName;
        if (productDescription) product.productDescription = productDescription;
        if (categories) product.categories = categories;
        if (productImages) product.productImages[0].imageUrl = productImages[0].imageUrl;
        if (harvestingDate) product.harvestingDate = harvestingDate;
        if (agricationMethod) product.agricationMethod = agricationMethod;
        if (freeDelivery !== undefined) product.freeDelivery = freeDelivery;

        await product.save();

        return NextResponse.json({
            message: "Product updated successfully",
            product
        }, { status: 200 });

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: "Error updating product", error: error.message }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json(
                { message: "Product ID is required" },
                { status: 400 }
            );
        }

        await DBconnect();

        const deleteProduct = await Product.findById(productId);
        if (!deleteProduct) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        await Product.findByIdAndDelete(productId);

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Delete error:', error);
        return NextResponse.json(
            {
                message: "Failed to delete product",
                error: process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
            },
            { status: 500 }
        );
    }
};