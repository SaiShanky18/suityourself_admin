import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Function to perform the WiPay payment request
async function performWiPayPayment(cartItems: any, customer: any) {

  const productId = cartItems[0].item._id;
  const quantity = cartItems[0].quantity;
  const colour = cartItems[0].colour;
  const size = cartItems[0].size;
  const startDate = cartItems[0].startDate;
  const endDate = cartItems[0].endDate;

  const clerkId = customer.clerkId;
  const email = customer.email;
  const name = customer.name;

  // Create headers
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Authorization', `Bearer ${process.env.WIPAY_API_KEY}`); // Add the API key to the headers

  // Calculate the total amount
  const totalAmount = cartItems.reduce((total: number, item: any) => total + item.totalPrice, 0).toFixed(2);

  // Create parameters
  const parameters = new URLSearchParams();
  parameters.append('account_number', process.env.WIPAY_ACCOUNT_NUMBER || ''); // Use your actual account number or environment variable
  parameters.append('avs', '0');
  parameters.append('country_code', 'TT');
  parameters.append('currency', 'TTD');
  parameters.append('data', JSON.stringify("productID:"+ productId + "~"+ "quantity:"+ quantity + "~"+ "colour:"+colour + "~"+ "size:"+size + "~"+ "startDate:"+startDate + "~"+ "endDate:"+endDate + "~"+ "clerkId:"+clerkId + "~"+ "email:"+email + "~"+ "name:"+name));
  //parameters.append('data', JSON.stringify({ cartItems, customer }));
  //console.log('data', ({ cartItems, customer }))
  parameters.append('environment', 'sandbox'); // Change to 'live' for production
  parameters.append('fee_structure', 'merchant_absorb'); //can change to "customer_pay" or "split"
  parameters.append('method', 'credit_card');
  parameters.append('order_id', `oid_${Date.now()}`); // Example order ID
  parameters.append('origin', 'SuitYourselfTT'); // Change to your actual app name
  parameters.append('response_url', `${process.env.ECOMMERCE_STORE_URL}/payment_result`); // Change to your actual response URL
  parameters.append('total', totalAmount);
  parameters.append('version', '1.0.0');
  parameters.append('addr1', '');
  parameters.append('addr2', '');
  parameters.append('city', '');
  parameters.append('country', 'TT');
  parameters.append('email', '');
  parameters.append('fname', '');
  parameters.append('lname', '');
  parameters.append('phone', '');
  parameters.append('zipcode', '');

  // Configure fetch options
  const options: RequestInit = {
    method: 'POST',
    headers: headers,
    body: parameters,
    redirect: 'follow',
  };

  // Perform the fetch request
  const response = await fetch('https://tt.wipayfinancial.com/plugins/payments/request', options);
  const resultText = await response.text();

  // Parse the JSON response
  const result = JSON.parse(resultText);

  return result.url; // Return the payment URL to redirect the user
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer } = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    // Get the payment URL from WiPay
    const paymentUrl = await performWiPayPayment(cartItems, customer);

    // Return the payment URL to the client
    return NextResponse.json({ url: paymentUrl }, { headers: corsHeaders });
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
