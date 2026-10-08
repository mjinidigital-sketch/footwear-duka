import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/login"]);
const isSignUpPage = createRouteMatcher(["/signup"]);
const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    const isAuthenticated = await convexAuth.isAuthenticated();

    if (isProtectedRoute(request) && !isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/login");
    }

    if ((isSignInPage(request) || isSignUpPage(request)) && isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/");
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};