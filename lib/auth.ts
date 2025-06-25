import { auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';

export async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorized');
    }

    let user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        const { user: clerkUser } = await auth();
        user = await prisma.user.create({
            data: {
                clerkId: userId,
                email: clerkUser?.emailAddresses[0]?.emailAddress || '',
                name: clerkUser?.fullName || '',
            },
        });
    }

    return user;
}
