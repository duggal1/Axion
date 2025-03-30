import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AuthCallbackPage = async () => {
    const user = await currentUser();
    
    if (!user?.id || !user.emailAddresses[0].emailAddress) {
        return redirect("/auth/signin");
    }

    // Check if user exists in database
    const existingUser = await db.user.findUnique({
        where: {
            clerkId: user.id,
        },
    });
    
    // If user doesn't exist, create a new record
    if (!existingUser) {
        await db.user.create({
            data: {
                id: user.id,
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || user.emailAddresses[0].emailAddress.split('@')[0],
                avatar: user.imageUrl,
            },
        });
        
        // Redirect to dashboard after user creation
        return redirect("/dashboard");
    }

    // User exists, update their details
    await db.user.update({
        where: {
            clerkId: user.id,
        },
        data: {
            email: user.emailAddresses[0].emailAddress,
            name: user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.firstName || existingUser.name,
            avatar: user.imageUrl || existingUser.avatar,
            updatedAt: new Date(),
        },
    });

    // Redirect to dashboard after successful authentication
    return redirect("/dashboard");
};

export default AuthCallbackPage
