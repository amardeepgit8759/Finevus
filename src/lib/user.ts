import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function syncUser() {
  try {
    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    // Upsert user into our database to ensure they exist
    // Returning null on failure to avoid hanging server-side rendering
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: { email },
      create: {
        id: user.id,
        email: email,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Critical: syncUser failed. Database might be locked or misconfigured.", error);
    return null;
  }
}

