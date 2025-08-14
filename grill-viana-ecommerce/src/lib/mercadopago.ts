import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

export const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
export const mpPreference = new Preference(mp);
export const mpPayment = new Payment(mp);

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN ausente no ambiente");
}
console.log("MP token prefix:", process.env.MP_ACCESS_TOKEN.slice(0, 5)); // ex.: TEST- ou APP_U
