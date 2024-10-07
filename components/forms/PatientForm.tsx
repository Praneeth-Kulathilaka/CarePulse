"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { PROJECT_ID } from "@/lib/appwrite.config"



const formSchema = z.object({
    name: z
        .string()
        .min(2, {message: "Username must be at least 2 characters.",})
        .max(50,{message: "Username must be at most 50 characters"}),
    email: z.string().email("Invalid Email Address"),
    phone: z
        .string()
        .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),    
});

const PatientForm = () =>  {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name: "",
        email: "",
        phone: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const user = {
                name: values.name,
                email: values.email,
                phone: values.phone
            };

            console.log("Created user",user);

            console.log("Database endpoint",process.env.PROJECT_ID)
            

            const newUser = await createUser(user);

            console.log("User Created", newUser);
            

            if(newUser) {
                router.push(`patients/${newUser.$id}/register`)
            }
        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
    }
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-8">
            <section className="mb-12 space-y-4">
                <h1 className="header">Hi there 👋</h1>
                <p className="text-dark-700">Get started with appointments.</p>
            </section>
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Full name"
                placeholder="John Doe"
                iconSrc="/assets/icons/user.svg"
                iconAlt="user"
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="johndoe@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
            />
            <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone number"
                placeholder="(555) 123-4567"
            />
            <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
        </Form>
    )
}


export default PatientForm