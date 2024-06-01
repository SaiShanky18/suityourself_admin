"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useParams, useRouter } from "next/navigation"

import { Separator } from '@/components/ui/separator'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import ImageUpload from "../custom ui/ImageUpload"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Delete from "../custom ui/Delete"
import MultiText from "../custom ui/MultiText"
import MultiSelect from "../custom ui/MultiSelect"
import Loader from "../custom ui/Loader"
import ReserveDates from "../custom ui/Calendar"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

import { getProductDetails } from "@/lib/actions/actions"

interface ProductFormProps {
    initialData?: ProductType | null; //Must have "?" to make it optional
    bookings?: any[];
}

const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    media: z.array(z.string()),
    category: z.string(),
    collections: z.array(z.string()),
    tags: z.array(z.string()),
    sizes: z.array(z.string()),
    colours: z.array(z.string()),
    price: z.coerce.number().min(0.10),
    expense: z.coerce.number().min(0.10),
    availableStartDate: z.date(),
    availableEndDate: z.date(),
    bookings: z.array(z.date()).optional(),
});

const ProductForm: React.FC<ProductFormProps> = ({ initialData, bookings }) => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState<CollectionType[]>([])
    const [dates, setDates] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(2099, 4, 18), 0),
    })

    const getCollections = async () => {
        try {
            const res = await fetch("/api/collections", {
                method: "GET",
            });
            const data = await res.json();
            setCollections(data);
            setLoading(false);
        } catch (err) {
            console.log("[collections_GET]", err)
            toast.error("Something went wrong! Please try again.")
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                ...initialData,
                collections: initialData.collections.map(
                    (collection) => collection._id
                ),
            }
            : {
                title: "",
                description: "",
                media: [],
                category: "",
                collections: [],
                tags: [],
                sizes: [],
                colours: [],
                price: 0.10,
                expense: 0.10,
                availableStartDate: dates?.from,
                availableEndDate: dates?.to,
                bookings: bookings,
            },
    });

    useEffect(() => {
        getCollections();
        form.setValue("availableStartDate", dates?.from!);
        form.setValue("availableEndDate", dates?.to!);
    }, [dates, form]);

    


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const url = initialData ? `/api/products/${initialData._id}` : "/api/products";
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(values),
            });
    
            if (res.ok) {
                setLoading(false);
                toast.success(`Products ${initialData ? "updated" : "created"} `);
                window.location.href = '/products';
                router.push("/products");
            }
        } catch (err) {
            console.log("[products_POST]", err);
            toast.error("Something went wrong! Please try again.");
        }
    };
    
    

    return loading ? <Loader /> : (
        <div className='p-10'>
            {initialData ? (
                <div className="flex items-center justify-between">
                    <p className='text-heading2-bold'>Edit Product</p>
                    <Delete id={initialData._id} item="product" />
                </div>
            ) : (
                <p className='text-heading2-bold'>Create Product</p>
            )}

            <Separator className='bg-grey-1 mt-4 mb-7' />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description" {...field} rows={5} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="media"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={(url) => field.onChange([...field.value, url])}
                                        onRemove={(url) => field.onChange([...field.value.filter((image) => image !== url)])}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />

                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price (TT$)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Price" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expense"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expense (TT$)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Expense" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder="Tags"
                                            value={field.value}
                                            onChange={(tag) => field.onChange([...field.value, tag])}
                                            onRemove={(tagToRemove) => field.onChange([...field.value.filter((tag) => tag !== tagToRemove)])}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        {collections.length > 0 && (
                            <FormField
                                control={form.control}
                                name="collections"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Collections</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                placeholder="Collections"
                                                collections={collections}
                                                value={field.value}
                                                onChange={(_id) => field.onChange([...field.value, _id])}
                                                onRemove={(idToRemove) => field.onChange([...field.value.filter((collectionId) => collectionId !== idToRemove),])}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-1" />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="colours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Colour</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder="Colour"
                                            value={Array.isArray(field.value) ? field.value : []} // Ensure field.value is an array
                                            onChange={(colour) => field.onChange([...(field.value || []), colour])} // Check if field.value is defined before accessing it
                                            onRemove={(colourToRemove) => field.onChange((field.value || []).filter((colour) => colour !== colourToRemove))} // Check if field.value is defined before accessing it
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder="Size"
                                            value={Array.isArray(field.value) ? field.value : []} // Ensure field.value is an array
                                            onChange={(size) => field.onChange([...(field.value || []), size])} // Check if field.value is defined before accessing it
                                            onRemove={(sizeToRemove) => field.onChange((field.value || []).filter((size) => size !== sizeToRemove))} // Check if field.value is defined before accessing it
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                     {/* 
                    <div className='flex flex-col gap-2'>
                        <p className='text-base-medium text-black'>Available Dates</p>
                        <div className='flex gap-2'>
                            <ReserveDates date={dates} setDate={setDates} />
                        </div>
                    </div>
                    */}


                    <div className="flex gap-10">
                        <Button type="submit" className="bg-blue-1 text-white">Submit</Button>
                        <Button type="button" className="bg-blue-1 text-white" onClick={() => router.push("/products")}>Discard</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ProductForm
