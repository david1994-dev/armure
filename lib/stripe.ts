import Stripe from "stripe";

// Deliberately not validated at module load: Next.js evaluates route handler modules during
// build to collect route config, which would otherwise fail the entire build over a missing key
// on routes that don't even use Stripe yet. The Stripe SDK requires *some* non-empty string to
// construct, so an unset key falls back to a placeholder — an unset/invalid key then surfaces as
// a normal Stripe API auth error the first time a request actually calls the API, not a build failure.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_unset");
