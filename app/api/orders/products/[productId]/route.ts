import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {

    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        await connectToDB();

        const objectId = new mongoose.Types.ObjectId(params.productId);

        console.log("This is the product ID:", params.productId)

        const bookings = await Order.find({
            "products.product": objectId,
            "products.endDate": { $gt: yesterday }
        });

        if (bookings.length > 0) {
            console.log("Bookings:", bookings);
            return NextResponse.json(bookings, { status: 200 })
        } else {
            console.log("No bookings found");
        }

    } catch (err) {
        console.log("[productId_GET]", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic";




