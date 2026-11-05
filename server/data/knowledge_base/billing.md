# Billing & Activation Policy

## 1. Payment Verification
* A successful payment must be verified in the internal transaction ledger before discussing plan activation.
* Agents must confirm that the transaction status is marked as `paid` with a valid transaction ID.

## 2. Subscription Activation Mismatch
* If a customer's payment was successfully deducted but their account plan still reflects `free`, this indicates a webhook/provisioning failure.
* **Protocol:** Acknowledge the payment confirmation to the customer. Explain that their payment was verified, apologize for the provisioning delay, and escalate ticket to the Billing Engineering team for manual activation sync within 2 business hours.
* **Prohibition:** Agents cannot manually toggle plan tiers or claim activation has already happened without an engineering sync record.
* **Privacy:** Never expose full credit card numbers or internal transaction payloads in customer-facing messages.
