import Customer from "../models/Customer"
import Order from "../models/Order"
import { connectToDB } from "../mongoDB"
import mongoose from 'mongoose';

export const getTotalSales = async () => {
    await connectToDB()
    const orders = await Order.find()
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)
    return { totalOrders, totalRevenue }
}


export const getTotalCustomers = async () => {
    await connectToDB()
    const customers = await Customer.find()
    const totalCustomers = customers.length
    return totalCustomers
}

export const getSalesPerMonth = async () => {
    await connectToDB()
    const orders = await Order.find()

    const salesPerMonth = orders.reduce((acc, order) => {
        const monthIndex = new Date(order.createdAt).getMonth() //0 for Jan. --> 11 for Dec.
        acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount

        return acc
    }, {})

    const graphData = Array.from({ length: 12 }, (_, i) => {
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i))
        return { name: month, sales: salesPerMonth[i] || 0 }
    })

    return graphData
}

export const getProductDetails = async (productId: string) => {
    // Log the productId before making the fetch request
    console.log('Product ID:', productId);

    const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, { cache: 'no-store' });
    console.log('This is product:', product)
    return await product.json();
}