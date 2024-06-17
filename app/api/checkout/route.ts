import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    /*try {
        const { cartItems, customer } = await req.json();

        if (!cartItems || !customer) {
            return new NextResponse("Not enough data to checkout", { status: 400 })
        }

        const session = await stripe.checkout.sessions.create({ //stripe---------------------------------------
            payment_method_types: ["card"],
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: ["TT"],
            },
            shipping_options: [
                { shipping_rate: "" dont think I can get this },
                { shipping_rate: "" dont think I can get this },
            ],
            line_items: cartItems.map((cartItem: any) => ({
                price_data: {
                    currency: "ttd",
                    product_data: {
                        name: cartItem.item.title,
                        metadata: {
                            productId: cartItem.item._id,
                            ...(cartItem.size && { size: cartItem.size }),
                            ...(cartItem.colour && { colour: cartItem.colour }),
                            ...(cartItem.startDate && { startDate: cartItem.startDate}),
                            ...(cartItem.endDate && { endDate: cartItem.endDate}),
                        },
                    },
                    unit_amount: cartItem.totalPrice * 100,
                },
                quantity: cartItem.quantity,
            })),
            client_reference_id: customer.clerkId,
            success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_result`,
            cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
        })

        return NextResponse.json(session, { headers: corsHeaders })


    } catch (err) {
        console.log("[checkout_POST]", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }*/

    return null;
}

export const dynamic = "force-dynamic";

