# Admin Guide

## Creating an Invitation Code

1. Go to **Supabase → Table Editor → invitations**.
2. Click **Insert row** and fill in the following fields:

   | Field | Value |
   |---|---|
   | `code` | The code you'll give the client (e.g. `BAKERY-002`). Uppercase, no spaces. |
   | `email` | The client's email address. |
   | `store_id` | The UUID of the store that belongs to this client. Find it in the `stores` table. |
   | `used_at` | Leave **NULL**. Gets set automatically when the client signs up. |
   | `expires_at` | Set a future date if you want the code to expire, or leave **NULL** for no expiry. |

3. Send the code to the client manually (WhatsApp, email, etc.).
4. Once they sign up, `used_at` will be automatically populated — the code cannot be reused.

## Revoking an Invitation

To cancel an unused code, delete the row from the `invitations` table in Supabase. Only do this before the client has signed up — once `used_at` is set, the account already exists and deleting the row has no effect.
