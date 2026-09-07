# @rightandabove/communication-email-nest

NestJS transactional email: send via `SendCommunicationEmailCommand` (CQRS), SMTP through nodemailer, events for sent / failed delivery.

**Install:** `npm i @rightandabove/communication-email-nest`

Peer deps: `@nestjs/common`, `@nestjs/core`, `@nestjs/cqrs`, `rxjs`. Depends on [`@rightandabove/communication-email-core`](https://www.npmjs.com/package/@rightandabove/communication-email-core).

## Quick start

```ts
CommunicationEmailModule.forRoot({
  // SMTP + default from — see GitHub README / .env.example
})
```

Supports `to`, `cc`, `bcc`, `replyTo`, `text`, `html`, and a default sender.

### Environment

- Required: `COMMUNICATION_EMAIL_SMTP_HOST`, `COMMUNICATION_EMAIL_SMTP_PORT`
- Optional: `COMMUNICATION_EMAIL_SMTP_SECURE`, `COMMUNICATION_EMAIL_SMTP_USER`, `COMMUNICATION_EMAIL_SMTP_PASSWORD`, `COMMUNICATION_EMAIL_DEFAULT_FROM_EMAIL`, `COMMUNICATION_EMAIL_DEFAULT_FROM_NAME`

Not in scope: IMAP, campaigns, unsubscribe, bounce analytics.

## Sibling packages

| Package | Role |
| --- | --- |
| [`communication-email-core`](https://www.npmjs.com/package/@rightandabove/communication-email-core) | Schemas & shared types |
| `communication-email-nest` | This package |
| [`communication-email-react`](https://www.npmjs.com/package/@rightandabove/communication-email-react) | Headless React passthrough |

## Docs & source

Full guide: [GitHub README](https://github.com/raa-org/communication-email#readme)  
Repository: [raa-org/communication-email](https://github.com/raa-org/communication-email)  
License: MIT · Right&Above, LLC
