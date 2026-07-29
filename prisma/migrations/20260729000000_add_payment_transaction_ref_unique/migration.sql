-- Prevents concurrent/retried webhook deliveries for the same Stripe session or PayPal order
-- from racing past a read-then-write check and creating duplicate Orders/Payments.
CREATE UNIQUE INDEX "payments_transaction_ref_key" ON "payments"("transaction_ref");
