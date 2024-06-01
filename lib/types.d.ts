type CollectionType = {
    _id: string;
    title: string;
    description: string;
    image: string;
    products: ProductType[];
}

type ProductType = {
    _id: string;
    title: string;
    description: string;
    media: [string];
    category: string;
    collections: [CollectionType];
    tags: [string];
    sizes: [string];
    colours: [string];
    price: number;
    expense: number;
    createdAt: Date;
    updatedAt: Date;
    availableStartDate: Date;
    availableEndDate: Date;
    bookings: any[];
}

type OrderColumnType = {
    _id: string;
    customer: string;
    products: number;
    totalAmount: number;
    createdAt: string;
}

type OrderItemType = {
    product: ProductType;
    colour: string;
    size: string;
    quantity: number;
}

type CustomerType = {
    clerkId: string;
    name: string;
    email: string;
}