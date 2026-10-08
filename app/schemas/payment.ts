import * as z from "zod";

// MPESA Payment Form Schema
export const mpesaPaymentSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must not exceed 12 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  amount: z.number().positive("Amount must be greater than 0"),
});

export type MpesaPaymentSchema = z.infer<typeof mpesaPaymentSchema>;

// Shipping Address Schema
export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must not exceed 12 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export type ShippingAddressSchema = z.infer<typeof shippingAddressSchema>;

// Order Creation Schema
export const orderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  notes: z.string().optional(),
});

export type OrderSchema = z.infer<typeof orderSchema>;

// Payment Status Schema
export const paymentStatusSchema = z.object({
  status: z.union([
    z.literal("pending"),
    z.literal("completed"),
    z.literal("failed"),
    z.literal("cancelled"),
  ]),
  resultCode: z.string().optional(),
  resultDesc: z.string().optional(),
});

export type PaymentStatusSchema = z.infer<typeof paymentStatusSchema>;

// Order Status Schema
export const orderStatusSchema = z.object({
  status: z.union([
    z.literal("pending"),
    z.literal("processing"),
    z.literal("shipped"),
    z.literal("delivered"),
    z.literal("cancelled"),
  ]),
});

export type OrderStatusSchema = z.infer<typeof orderStatusSchema>;
