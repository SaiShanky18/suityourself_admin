import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns"

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB()

        const orders = await Order.find().sort({ createdAt: "desc" })

        const orderDetails = await Promise.all(orders.map(async (order) => {
            const customer = await Customer.findOne({ clerkId: order.customerClerkId })
        
            return {
                _id: order._id,
                customer: customer.name,
                bookingFrom: format(order.products[0].startDate, "dd/MM/yyyy"),
                bookingTo: format(order.products[0].endDate, "dd/MM/yyyy"),
                totalAmount: order.totalAmount,
                createdAt: format(order.createdAt, "dd/MM/yyyy")
            }
        }))

        return NextResponse.json(orderDetails, { status: 200 })

    } catch (err) {
        console.log("[orders.GET", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic";