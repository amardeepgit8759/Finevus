import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  
  if (!isPublicRoute(request) && !userId) {
    return (await auth()).redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Optimized matcher for Next.js 14 and Clerk v5
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

