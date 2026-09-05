# n8n-nodes-qwease

Community node for [n8n](https://n8n.io) — connect workflows to [Qwease](https://qwease.fr) ITSM (tickets, helpdesk, MSP).

## Install

**Settings → Community nodes → Install** → enter:

```
n8n-nodes-qwease
```

Or link locally during development:

```bash
npm run build
npm link
cd ~/.n8n/custom
npm link n8n-nodes-qwease
```

## Credentials

Create a **Qwease API** credential:

- **API Token**: your Qwease bearer token (Administration). Paste the token only, without `Bearer`.

Test calls `GET https://rest.qwease.fr/api/me/`.

## Nodes (v0.3)

### Qwease (action)

| Resource | Operations |
|----------|------------|
| **Ticket** | Create · Get · Get Many · Update · Add Comment |
| **User** | Create · Get · Get Many · Update |
| **Organization** | Create · Get · Get Many · Update (`/client/`) |
| **Device** | Create · Get · Get Many · Update |
| **Team** | Create · Get · Get Many · Update |
| **Knowledge** | Create · Get · Get Many · Update · Update Content · Search |
| **Task** | Create · Get · Get Many · Update |
| **Search** | Advanced Search · Quick Search |
| **Me** | Get |

Related objects use **From list / By ID**. Create flows show essential fields; optionals under **Additional Fields**.

### Qwease Trigger (webhook)

Starts on Qwease outbound webhooks:

1. Activate the workflow and copy the Production webhook URL.
2. Qwease Admin → Integrations → Webhooks → create URL + save the **secret** (shown once).
3. Run **Test** on the webhook in Qwease.
4. Automation → trigger event → action **Send webhook**.
5. Paste the secret into the trigger node; optionally filter `event_type` values.

Signature: HMAC-SHA256 header `X-Qwease-Signature-256` (raw hex). See [KB webhooks](https://app.notion.com/p/3cd7035fdb12819ea9b4e6487c384cc6).

API reference: https://rest.qwease.fr/swagger/

### Smoke local

```bash
npm run build
npm link
n8n start
```

Always rebuild then restart n8n after code changes.

## License

MIT
