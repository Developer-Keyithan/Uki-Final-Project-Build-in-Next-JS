import { NextRequest, NextResponse } from 'next/server';
import DBconnect from '../../../../lib/db';
import Product from '../../../../lib/Models/Product';
import { Types } from 'mongoose';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const {
            userId,
            productImages,
            productName,
            productDescription,
            price,
            categories,
            harvestingDate,
            agricationMethod,
            freeDelivery
        } = body;

        if (!productImages || productImages.length === 0) {
            return NextResponse.json(
                { message: "At least one product image is required" },
                { status: 400 }
            );
        }

        if (!categories || categories.length === 0) {
            return NextResponse.json(
                { message: "At least one category is required" },
                { status: 400 }
            );
        }

        if (!price || !price.newPrice) {
            return NextResponse.json(
                { message: "New price is required" },
                { status: 400 }
            );
        }

        if (freeDelivery === undefined) {
            return NextResponse.json(
                { message: "Free delivery status is required" },
                { status: 400 }
            );
        }

        await DBconnect();

        const newProduct = new Product({
            userId: new Types.ObjectId(userId),
            productImages,
            productName,
            productDescription,
            price,
            categories,
            harvestingDate,
            agricationMethod,
            freeDelivery
        });

        await newProduct.save();

        return NextResponse.json({
            message: "Product added successfully",
            product: newProduct
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error adding product:", error);

        return NextResponse.json({
            message: "Error adding product",
            error: error.message
        }, { status: 500 });
    }
};

export const GET = async () => {
    try {
        await DBconnect();
        const products = await Product.find()

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch all products data." }, { status: 500 });
    }
}

export const PATCH = async (req: NextRequest) => {
    try {
        const { productId, price, productName, productDescription, categories, harvestingDate, agricationMethod, freeDelivery } = await req.json();
        await DBconnect();

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        if (price && product.price.newPrice !== price) {
            product.price.oldPrice = product.price.newPrice;
            product.price.newPrice = price;
        }

        if (productName) product.productName = productName;
        if (productDescription) product.productDescription = productDescription;
        if (categories) product.categories = categories;
        if (harvestingDate) product.harvestingDate = harvestingDate;
        if (agricationMethod) product.agricationMethod = agricationMethod;
        if (freeDelivery !== undefined) product.freeDelivery = freeDelivery;

        await product.save();

        return NextResponse.json({
            message: "Product updated successfully",
            product
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Error updating product", error: error.message }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const { productId } = await req.json();

        await DBconnect();

        const deleteProduct = await Product.findById(productId);

        if (!deleteProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        await Product.findByIdAndDelete(productId);

        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Can't delete product", error: error.message }, { status: 500 });
    }
};