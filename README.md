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
cd ~/.n8n/custom  # or your n8n custom extension folder
npm link n8n-nodes-qwease
```

## Credentials

Create a **Qwease API** credential:

- **API Token**: your Qwease bearer token (Administration). Paste the token only, without `Bearer`.

Test calls `GET https://rest.qwease.fr/api/me/`.

## Resources (v0.2)

| Resource | Operations |
|----------|------------|
| **Ticket** | Create · Get · Get Many · Update · Add Comment |
| **User** | Create · Get · Get Many · Update |
| **Organization** | Create · Get · Get Many · Update (`/client/`) |
| **Device** | Create · Get · Get Many · Update |
| **Team** | Get · Get Many |
| **Search** | Advanced Search (`POST /advanced-search/`) · Quick Search (`GET /search/`) |
| **Me** | Get (token / profile ping) |

Related objects use **From list / By ID** resource locators. Create flows show essential fields; optionals live under **Additional Fields**.

API reference: https://rest.qwease.fr/swagger/

### Smoke local (npm link)

```bash
npm run build
npm link
# ~/.n8n/custom → npm link n8n-nodes-qwease
n8n start
```

After code changes: **always** `npm run build` then restart n8n.

Release (tags trigger npm publish with provenance):

```bash
npm run release
```

Configure npm **Trusted Publisher** on GitHub Actions workflow `publish.yml` before verification submit.

## License

MIT
