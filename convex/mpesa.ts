"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  getTimeStamp,
  generatePassword,
  formatPhoneNumber,
  getMpesaBaseUrl,
} from "./mpesaUtils";

/**
 * Get MPESA OAuth access token
 */
async function getMpesaAccessToken(
  consumerKey: string,
  consumerSecret: string,
  environment: "sandbox" | "production"
): Promise<string> {
  const credentials = `${consumerKey.trim()}:${consumerSecret.trim()}`;
  const auth =
    typeof Buffer !== "undefined"
      ? Buffer.from(credentials).toString("base64")
      : btoa(credentials);
  const baseUrl = getMpesaBaseUrl(environment);
  const url = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get MPESA access token (${response.status} ${response.statusText}): ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Initiate MPESA STK Push payment
 */
export const initiateStkPush = action({
  args: {
    phoneNumber: v.string(),
    amount: v.number(),
    sessionId: v.string(),
    userId: v.optional(v.id("users")),
    consumerKey: v.string(),
    consumerSecret: v.string(),
    businessShortCode: v.string(),
    passKey: v.string(),
    callbackUrl: v.string(),
    environment: v.union(v.literal("sandbox"), v.literal("production")),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    paymentId: Id<"payments">;
    checkoutRequestId: string;
    responseCode: string;
    responseMessage: string;
  }> => {
    const {
      phoneNumber,
      amount,
      sessionId,
      userId,
      consumerKey,
      consumerSecret,
      businessShortCode,
      passKey,
      callbackUrl,
      environment,
    } = args;

    const baseUrl = getMpesaBaseUrl(environment);

    try {
      // Get access token
      const accessToken = await getMpesaAccessToken(consumerKey, consumerSecret, environment);

      // Generate timestamp and password
      const timestamp = getTimeStamp();
      const password = generatePassword(businessShortCode, passKey, timestamp);

      // Format phone number
      const formattedPhone = formatPhoneNumber(phoneNumber);

      // Create pending payment record
      const paymentId: Id<"payments"> = await ctx.runMutation(api.payments.createPayment, {
        userId,
        sessionId,
        amount,
        phoneNumber: formattedPhone,
        status: "pending",
      });

      // Prepare STK Push request
      const stkUrl = `${baseUrl}/mpesa/stkpush/v1/processrequest`;
      const body = {
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount.toString(),
        PartyA: formattedPhone,
        PartyB: businessShortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: "Footwear Duka",
        TransactionDesc: "Payment for Footwear Duka",
      };

      // Send STK Push request
      const response = await fetch(stkUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Update payment as failed
        await ctx.runMutation(api.payments.updatePaymentStatus, {
          paymentId,
          status: "failed",
          resultCode: response.status.toString(),
          resultDesc: `HTTP ${response.status}: ${errorText || response.statusText}`,
        });
        throw new Error(`STK Push failed (${response.status}): ${errorText || response.statusText}`);
      }

      const stkResponse = await response.json();

      // Update payment with checkout request ID
      if (stkResponse.ResponseCode === "0") {
        await ctx.runMutation(api.payments.updatePaymentCheckoutRequest, {
          paymentId,
          checkoutRequestId: stkResponse.CheckoutRequestID,
          merchantRequestId: stkResponse.MerchantRequestID,
        });
      } else {
        await ctx.runMutation(api.payments.updatePaymentStatus, {
          paymentId,
          status: "failed",
          resultCode: stkResponse.ResponseCode,
          resultDesc: stkResponse.ResponseDescription || stkResponse.errorMessage,
        });
      }

      return {
        success: stkResponse.ResponseCode === "0",
        paymentId,
        checkoutRequestId: stkResponse.CheckoutRequestID,
        responseCode: stkResponse.ResponseCode,
        responseMessage: stkResponse.ResponseDescription,
      };
    } catch (error) {
      console.error("STK Push Error:", error);
      throw error;
    }
  },
});

/**
 * Query MPESA transaction status
 */
export const queryTransactionStatus = action({
  args: {
    checkoutRequestId: v.string(),
    paymentId: v.id("payments"),
    consumerKey: v.string(),
    consumerSecret: v.string(),
    businessShortCode: v.string(),
    passKey: v.string(),
    environment: v.union(v.literal("sandbox"), v.literal("production")),
  },
  handler: async (ctx, args): Promise<{
    resultCode: string;
    resultDesc: string;
    success: boolean;
  }> => {
    const {
      checkoutRequestId,
      paymentId,
      consumerKey,
      consumerSecret,
      businessShortCode,
      passKey,
      environment,
    } = args;

    const baseUrl = getMpesaBaseUrl(environment);

    try {
      // Get access token
      const accessToken = await getMpesaAccessToken(consumerKey, consumerSecret, environment);

      // Generate timestamp and password
      const timestamp = getTimeStamp();
      const password = generatePassword(businessShortCode, passKey, timestamp);

      // Query endpoint
      const queryUrl = `${baseUrl}/mpesa/stkpushquery/v1/query`;
      const body = {
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await fetch(queryUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }

      const statusResponse = await response.json();

      // Update payment status based on result
      const resultCode = statusResponse.ResultCode;
      const resultDesc = statusResponse.ResultDesc;

      if (resultCode === "0") {
        await ctx.runMutation(api.payments.updatePaymentStatus, {
          paymentId,
          status: "completed",
          resultCode: resultCode.toString(),
          resultDesc,
          mpesaReceiptNumber: statusResponse.MpesaReceiptNumber,
          transactionDate: statusResponse.TransactionDate,
        });
      } else if (resultCode === "1032") {
        await ctx.runMutation(api.payments.updatePaymentStatus, {
          paymentId,
          status: "cancelled",
          resultCode: resultCode.toString(),
          resultDesc: "Request cancelled by the user",
        });
      } else {
        await ctx.runMutation(api.payments.updatePaymentStatus, {
          paymentId,
          status: "failed",
          resultCode: resultCode.toString(),
          resultDesc,
        });
      }

      return {
        resultCode,
        resultDesc,
        success: resultCode === "0",
      };
    } catch (error) {
      console.error("Query Error:", error);
      throw error;
    }
  },
});
