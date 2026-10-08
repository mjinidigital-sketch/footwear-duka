import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// MPESA Callback Endpoint
http.route({
  path: "/mpesa/callback",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();

      // Validate callback structure
      if (!body.Body || !body.Body.stkCallback) {
        return new Response(
          JSON.stringify({ error: "Invalid callback structure" }),
          { status: 400 }
        );
      }

      const checkoutRequestId = body.Body.stkCallback.CheckoutRequestID;

      if (!checkoutRequestId) {
        return new Response(
          JSON.stringify({ error: "Missing CheckoutRequestID" }),
          { status: 400 }
        );
      }

      // Process the callback
      await ctx.runMutation(api.payments.processMpesaCallback, {
        checkoutRequestId,
        callbackData: body,
      });

      return new Response(
        JSON.stringify({
          message: "Callback received successfully",
          success: true,
        }),
        { status: 200 }
      );
    } catch (error) {
      console.error("MPESA Callback Error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500 }
      );
    }
  }),
});

export default http;
