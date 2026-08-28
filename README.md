# communication-email

Transactional email for a NestJS host: send through `SendCommunicationEmailCommand` (CQRS), SMTP via nodemailer, events for sent/failed delivery. The React package is a **headless** passthrough — it does not send mail and does not expose SMTP.

License: [MIT](LICENSE). Published as `@rightandabove/communication-email-*` on npm.

## Packages

| Package | Role |
| --- | --- |
| `@rightandabove/communication-email-core` | Types, Zod schemas, command/event names. Depends only on `zod`. |
| `@rightandabove/communication-email-nest` | `CommunicationEmailModule.forRoot()` and the send-command handler. |
| `@rightandabove/communication-email-react` | Headless provider only. |

Supports `to`, `cc`, `bcc`, `replyTo`, `text`, `html`, and a default sender. Not in scope: IMAP, campaigns, unsubscribe, bounce analytics.

## Environment

Copy [`.env.example`](./.env.example).

- Required: `COMMUNICATION_EMAIL_SMTP_HOST`, `COMMUNICATION_EMAIL_SMTP_PORT`
- Optional: `COMMUNICATION_EMAIL_SMTP_SECURE`, `COMMUNICATION_EMAIL_SMTP_USER`, `COMMUNICATION_EMAIL_SMTP_PASSWORD`, `COMMUNICATION_EMAIL_DEFAULT_FROM_EMAIL`, `COMMUNICATION_EMAIL_DEFAULT_FROM_NAME`

## Develop

```bash
npm install
npm run build
npm test
```

Publish each workspace package with `npm publish --access public` from `core/`, `nest/`, then `react/` after they are built.
