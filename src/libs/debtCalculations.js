import axios from "axios";

//TIPO DE CAMBIO
//!HAY QUE CAMBIAR EL TIPO DE CAMBIO A MEDIDA QUE CAMBIE, PARA EOS HAY QUE AGREGAR UNA OPCION PARA QUE LA EMPRESA DECIDA EL TIPO DE CAMBIO
const USD_TO_BS = 6.96;

function toBS(amount, currency) {
  return currency === "USD" ? amount * USD_TO_BS : amount;
}

export async function calculateTotalDebtBOB(debts) {
  return debts
    .reduce((sum, debt) => {
      const amount = parseFloat(debt.outstanding || 0);
      return sum + toBS(amount, debt.currency);
    }, 0)
    .toFixed(2);
}

export async function calculatePendingDebtBOB(debts) {
  return debts
    .filter((debt) => !debt.paid_at)
    .reduce((sum, debt) => {
      const amount = parseFloat(debt.outstanding || 0);
      return sum + toBS(amount, debt.currency);
    }, 0)
    .toFixed(2);
}

export async function calculateAveragePaymentTime(debts) {
  const paidDebts = debts.filter((debt) => debt.paid_at);
  if (paidDebts.length === 0) return 0;

  const totalDays = paidDebts.reduce((sum, debt) => {
    const issueDate = new Date(debt.issue_date);
    const paidAt = new Date(debt.paid_at);
    const diffDays = (paidAt - issueDate) / (1000 * 60 * 60 * 24);
    return sum + diffDays;
  }, 0);

  return parseFloat((totalDays / paidDebts.length).toFixed(2));
}

export async function calculatePaymentDelayRate(debts) {
  const paidDebts = debts.filter((debt) => debt.paid_at);
  if (paidDebts.length === 0) return 0;

  const delayed = paidDebts.filter(
    (debt) => new Date(debt.paid_at) > new Date(debt.due_date)
  ).length;
  return parseFloat((delayed / paidDebts.length).toFixed(2)); // e.g. 0.33
}

export async function calculateTheRiskOfDefault(data) {
  const apiUrl = process.env.RISK_API_URL;

  try {
    console.log("Datos que se van a enviar:", data);
    const response = await axios.post(apiUrl, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Respuesta de la API:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error al enviar los datos:",
      error.response?.data || error.message
    );
    throw new Error(error);
  }
}
