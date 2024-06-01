"use client"

import { useEffect, useState } from "react"

import Loader from "@/components/custom ui/Loader"
import ProductForm from "@/components/products/ProductForm"



const ProductDetails = ({ params }: { params: { productId: string } }) => {
    const [loading, setLoading] = useState(true)
    const [productDetails, setProductDetails] = useState<ProductType | null>(null)
    const [bookings, setBookings] = useState<any[]>([]);


    const getProductDetails = async () => {
        try {
            const res = await fetch(`/api/products/${params.productId}`, {
                method: "GET"
            })
            const data = await res.json()
            setProductDetails(data)
            setLoading(false)
            console.log("Fetched product details:", data);
        } catch (err) {
            console.log("[productId_GET]", err)
        }
    }

    useEffect(() => {
        getProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.productId]); // Execute useEffect whenever productId changes



    return loading ? <Loader /> : (
        <ProductForm initialData={productDetails} bookings={bookings} />
    )
}


export default ProductDetails
