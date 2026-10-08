import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: "top-right",
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: "top-right",
  });
};

export const showInfoToast = (message: string) => {
  toast.info(message, {
    duration: 3000,
    position: "top-right",
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: "top-right",
  });
};

export const dismissToast = (id: string | number) => {
  toast.dismiss(id);
};

export const handleAuthError = (error: unknown) => {
  console.error("Auth error:", error);

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Handle "Account ... already exists" error specifically
    if (errorMessage.includes("account") && errorMessage.includes("already exists")) {
      showErrorToast("An account with this email already exists. Please sign in instead.");
    } else if (errorMessage.includes("already exists") || errorMessage.includes("taken")) {
      showErrorToast("An account with this email already exists. Please sign in instead.");
    } else if (errorMessage.includes("email") || errorMessage.includes("user")) {
      showErrorToast("Invalid email or password. Please try again.");
    } else if (errorMessage.includes("password")) {
      showErrorToast("Password error. Please check your credentials.");
    } else if (errorMessage.includes("network") || errorMessage.includes("connection")) {
      showErrorToast("Network error. Please check your connection and try again.");
    } else if (errorMessage.includes("_id") || errorMessage.includes("null")) {
      showErrorToast("Account creation failed. Please try again or contact support.");
    } else if (errorMessage.includes("server error")) {
      showErrorToast("Server error occurred. Please try again later.");
    } else {
      // Clean up technical error messages for better UX
      const cleanMessage = error.message
        .replace(/\[Request ID: [^\]]+\]/g, "")
        .replace(/Uncaught Error: /g, "")
        .replace(/Server Error /g, "")
        .trim();
      showErrorToast(cleanMessage || "An unexpected error occurred. Please try again.");
    }
  } else {
    showErrorToast("An unexpected error occurred. Please try again.");
  }
};

export const handleValidationError = (message: string) => {
  showErrorToast(message);
};