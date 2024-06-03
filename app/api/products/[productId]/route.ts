import { NextRequest, NextResponse } from "next/server";

import Product from "@/lib/models/Products";
import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";
import { auth } from "@clerk/nextjs";


export const GET = async (
    req: NextRequest,
    { params }: { params: { productId: string } }
) => {
    try {
        console.log("Product ID:", params.productId); // Log the productId to check its value
        
        await connectToDB();

        const product = await Product.findById(params.productId).populate({ path: "collections", model: Collection })

        if (!product) {
            return new NextResponse(
                JSON.stringify({ message: "Product not found" }),
                { status: 404 }
            );
        }

        return new NextResponse(JSON.stringify(product), {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`, //here is the cors error
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });

    } catch (err) {
        console.log("[productId_GET]", err)
        return new NextResponse("Internal error", { status: 500 })
    }
};

export const POST = async (
    req: NextRequest,
    { params }: { params: { productId: string } }
) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectToDB()

        const product = await Product.findById(params.productId)

        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 })
        }

        const { title, description, media, category, collections, tags, sizes, colours, price, expense, availableStartDate, availableEndDate } = await req.json()

        if (!title || !description || !media || !category || !price || !expense || !availableStartDate || !availableEndDate) {
            return new NextResponse("Not enough data to create a new product", { status: 400 })
        }

        const addedCollections = collections.filter((collectionId: string) => !product.collections.includes(collectionId))
        //included in the new data but not included in the previous data

        const removedCollections = product.collections.filter((collectionId: string) => !collections.includes(collectionId))
        //included in the previous data but not included in the new data

        //Update collections
        await Promise.all([
            //update added collection with this product
            ...addedCollections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $push: { products: product._id },
                })
            ),
            //update removed collections without this product
            ...removedCollections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $pull: { products: product._id },
                })
            ),
        ]);

        //Update product
        const updatedProduct = await Product.findByIdAndUpdate(product._id, {
            title,
            description,
            media,
            category,
            collections,
            tags,
            sizes,
            colours,
            price,
            expense,
            availableStartDate,
            availableEndDate,
        }, { new: true }).populate({ path: "collections", model: Collection });

        await updatedProduct.save();

        return NextResponse.json(updatedProduct, { status: 200 });

    } catch (err) {
        console.log("[productId_POST]", err)
        return new NextResponse("Internal error", { status: 500 })
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await connectToDB()

        const product = await Product.findById(params.productId)

        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 })
        }

        const deletedProduct = await Product.findByIdAndDelete(product._id);

        if (!deletedProduct) {
            return new NextResponse(JSON.stringify({ message: "Failed to delete product" }), { status: 500 });
        }

        //Update collections
        await Promise.all(
            product.collections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $pull: { products: product._id }
                })
            ),
        );

        return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
            status: 200,
        });

    } catch (err) {
        console.log("[productId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";