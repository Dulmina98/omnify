"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {useUser} from "@clerk/nextjs";
import {api} from "@/convex/_generated/api";
import {useCurrentUser} from "@/services/user-service";

type AdminFormData = {
    firstName: string;
    lastName: string;
    mobileNumber: string;
};

export default function BecomeAdmin() {
    const {mutate: adminMutate} = useApiMutation(api.admins.createAdmin);
    const {user, isLoaded, isSignedIn} = useUser();
    const {user: currentUser, isLoaded: isUserLoaded} = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        if (isUserLoaded && currentUser) {
            router.push("/");
        }
    }, [isUserLoaded, currentUser, router]);

    const form = useForm<AdminFormData>({
        defaultValues: {
            firstName: "",
            lastName: "",
            mobileNumber: "",
        },
    });

    const onSubmit = async (data: AdminFormData) => {
        try {
            if (!user) {
                console.error("User is not signed in.");
                return;
            }

            const userEmail = user.emailAddresses?.find(email => email.id === user.primaryEmailAddressId)?.emailAddress ?? "";

            adminMutate({
                clerkId: user.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: userEmail,
                mobileNum: data.mobileNumber,
            }).then(() => {
                console.log("Admin created successfully");
                router.push("/");
            });
        } catch (error) {
            console.log(error);
        }
    };

    if (!isLoaded || !isUserLoaded) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn) {
        return <div>Please sign in to become an admin.</div>;
    }

    if (currentUser) {
        return <div>You are already a player or organizer. Redirecting...</div>;
    }

    return (
        <div className={"w-full min-h-screen relative flex "}>
            <div
                className={"w-1/2 bg-red-700 min-h-screen bg-[url(/assets/images/bg/become-member-bg.jpg)] bg-cover bg-right relative"}>
                <div className={"w-full h-full flex justify-end"}>
                    <div className={"max-w-[900px] h-full w-full relative"}>
                        <div className={"absolute left-0 bottom-14 text-white text-[48px] px-[25px] lg:px-[100px]"}>
                            Your Gateway to the World of Competitive Gaming.
                        </div>
                    </div>
                </div>
            </div>
            <div className={"w-1/2 min-h-screen h-full flex flex-col justify-center"}>
                <div className={"max-w-[900px] w-full px-[25px] lg:px-[100px] py-[200px]"}>
                    <div className={"mb-[60px]"}>
                        <div className={"text-[64px] text-white"}>Become an Admin</div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[35px]">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"text-white text-[16px] mb-[10px]"}>First Name</FormLabel>
                                        <FormControl>
                                            <Input className={"h-[46px]"}
                                                   placeholder="Enter your first name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"text-white text-[16px] mb-[10px]"}>Last Name</FormLabel>
                                        <FormControl>
                                            <Input className={"h-[46px]"}
                                                   placeholder="Enter your last name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mobileNumber"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"text-white text-[16px] mb-[10px]"}>Mobile
                                            Number</FormLabel>
                                        <FormControl>
                                            <Input className={"h-[46px]"}
                                                   placeholder="Enter your mobile number" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className={"flex gap-[20px] pt-[60px]"}>
                                <Button className={"h-[46px] w-[215px] text-[18px]"} type={"submit"}>Become an
                                    Admin</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
