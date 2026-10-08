import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/login"]);
const isSignUpPage = createRouteMatcher(["/signup"]);
const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    if (!isProtectedRoute(request) && !isSignInPage(request) && !isSignUpPage(request)) {
        return await convexAuth.nextjsServerSideClient(request, convexAuth);
    }

    const isAuthenticated = await convexAuth.isAuthenticated(request, convexAuth);

    if (isProtectedRoute(request) && !isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/login");
    }

    if ((isSignInPage(request) || isSignUpPage(request)) && isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/");
    }

    return await convexAuth.nextjsServerSideClient(request, convexAuth);
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};