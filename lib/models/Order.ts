import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerClerkId: String,
    customerPhone: Number,
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            colour: String,
            size: String,
            quantity: Number, // Corrected typo in "quantity"
            startDate: Date,
            endDate: Date,
        },
    ],
    shippingAddress: {
        streetNumber: String, // Corrected typo in "streetNumber"
        streetName: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    totalAmount: Number,
    createdAt: {
        type: Date, // Corrected type to Date
        default: Date.now,
    },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
