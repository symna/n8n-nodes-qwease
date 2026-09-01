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

## Operations (v0.1)

**Ticket**

| Operation | API |
|-----------|-----|
| Create | `POST /ticket/` |
| Get | `GET /ticket/{id}/` |
| Get Many | `GET /ticket/` |
| Update | `PATCH /ticket/{id}/` |

API reference: https://rest.qwease.fr/swagger/

## Development

```bash
npm install
npm run build
npm run lint
```

Release (tags trigger npm publish with provenance):

```bash
npm run release
```

Configure npm **Trusted Publisher** on GitHub Actions workflow `publish.yml` before verification submit.

## License

MIT
