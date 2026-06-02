<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ec96be31-82ee-4325-bffa-543030e34454

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firestore workspace security

The Firestore rules enforce a zero-trust workspace boundary: every read or write under
`/workspaces/{workspaceId}` requires `request.auth != null`. There is no public bypass
for `smm_workspace_main`; users must be authenticated and authorized for every
workspace, including that legacy shared workspace id.

### Supported roles

Workspace authorization accepts the following roles, ordered from least to most
privileged:

- `member` — can read operational workspace collections, plus their own membership
  document at `/workspaces/{workspaceId}/members/{uid}`.
- `manager` — includes member read access and can write operational workspace data
  such as `tasks`, `campaigns`, `logs`, and `files`.
- `admin` — includes manager access, can manage membership/role documents, and is
  the only workspace role allowed to read or write sensitive collections such as
  `secrets`, `billing`, and `integrations`.

### Custom claims schema

The preferred low-read authorization path is a Firebase Auth custom claim containing
per-workspace roles:

```json
{
  "workspaceRoles": {
    "smm_workspace_main": "admin",
    "workspace-alpha": "manager"
  }
}
```

A global admin claim is also supported for service owners who need admin access to
all workspaces:

```json
{
  "admin": true
}
```

### Role document schema

If custom claims are not present or have not propagated yet, the rules fall back to
workspace member documents. Each authorized user should have a document at:

```text
/workspaces/{workspaceId}/members/{uid}
```

with this minimum schema:

```json
{
  "active": true,
  "role": "member"
}
```

Set `role` to one of `member`, `manager`, or `admin`. Set `active` to `false` or
remove the document to revoke access. Only workspace admins may create, update, or
delete member role documents from client SDKs.

### Rules tests

Run the Firestore emulator rules suite with:

```bash
npm run test:rules
```
