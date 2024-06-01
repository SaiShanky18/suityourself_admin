import { DataTable } from "@/components/custom ui/DataTable"
import { columns } from "@/components/orderItems/OrderItemsColumn"
import { format } from "date-fns"

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
    const res = await fetch(`http://localhost:3000/api/orders/${params.orderId}`)
    const { orderDetails, customer } = await res.json()

    console.log(orderDetails)

    const { street, city, state, postalCode, country } = orderDetails.shippingAddress

    return (
        <div className="flex flex-col p-10 gap-5">
            <p className="text-base-bold">
                Order ID: <span className="text-base-medium">{orderDetails._id}</span>
            </p>
            <p className="text-base-bold">
                Customer Name: <span className="text-base-medium">{customer.name}</span>
            </p>
            <p className="text-base-bold">
                Shipping Address: <span className="text-base-medium">{street},{city},{state},{postalCode},{country}</span>
            </p>
            <p className="text-base-bold">
                Reservation Dates: <span className="text-base-medium">{format(orderDetails.products[0].startDate, 'dd-MM-yyyy')} TO {format(orderDetails.products[0].endDate,  'dd-MM-yyyy')}</span>
            </p>
            <p className="text-base-bold">
                Total Paid: <span className="text-base-medium">TT$ {orderDetails.totalAmount}</span>
            </p>
            
            <DataTable columns={columns} data={orderDetails.products} searchKey="product"/>
        </div>
    )
}

export default OrderDetails
