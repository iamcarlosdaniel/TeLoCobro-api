import axios from "axios";

export async function sendWhatsAppMessage(to, message) {

  try {
    const response = await axios.post(
      `${process.env.WHATSAPP_API_URL}/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      "Error enviando mensaje:",
      error.response?.data || error.message
    );
    return { success: false, error: error.response?.data || error.message };
  }
}
