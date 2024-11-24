import { randomBytes } from "crypto";

interface CreateOrderResponse {
  id: string;
  status: string;
}

interface CaptureOrderResponse {
  id: string;
  status: string;
  payer: {
    email_address: string;
  };
}

export async function createPayPalOrder(
  amount: number
): Promise<CreateOrderResponse> {
  const response = await fetch(
    `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getPayPalAccessToken()}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create PayPal order");
  }

  return response.json();
}

export async function capturePayPalOrder(
  orderId: string
): Promise<CaptureOrderResponse> {
  const response = await fetch(
    `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getPayPalAccessToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to capture PayPal order");
  }

  return response.json();
}

export function generateDownloadToken(): string {
  return randomBytes(32).toString("hex");
}

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(
    `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}
