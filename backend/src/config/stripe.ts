import Stripe from "stripe";
import { ENVVARS } from "../uitls/envVars";

export const stripe = new Stripe(ENVVARS.STRIPE_SECRET_KEY);
