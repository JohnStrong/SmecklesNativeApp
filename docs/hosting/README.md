# Hosting Evaluation — Smeckles

## Requirements Summary

| Requirement | Detail |
|-------------|--------|
| Frontend | React SPA (static assets) |
| Backend | Scala Play Framework (JVM) HTTP server |
| Access pattern | 5–10 requests/week, single user |
| Security | Private API key storage (encrypted), webapp auth (account/token-based) |
| Tooling | CLI support, infrastructure-as-code (IaC) |
| Growth path | Expandable to enterprise/multi-user later |
| Same account | Frontend + backend hosted together in one account/project |

---

## Evaluated Providers

### 1. AWS (Amazon Web Services)

| Criteria | Assessment |
|----------|------------|
| **React hosting** | S3 + CloudFront (static site) or AWS Amplify Hosting (git-deploy) |
| **JVM backend** | App Runner (container, scales to zero) or ECS Fargate or Elastic Beanstalk |
| **Secrets** | AWS Secrets Manager or SSM Parameter Store (encrypted, IAM-gated) |
| **Auth** | Amazon Cognito (user pools, hosted UI, token in cookie) |
| **CLI** | `aws` CLI, well-maintained |
| **IaC** | CloudFormation, CDK (TypeScript/Python), SAM, Terraform |
| **Docs** | Extensive — getting started guides for every service, tutorials, workshops |
| **Est. weekly cost** | ~$0.50–$2/week (Amplify free tier for frontend; App Runner scales to zero at ~$0 idle, Cognito free tier for <50k users, Secrets Manager $0.40/secret/month) |
| **Enterprise path** | Full AWS ecosystem — VPC, WAF, Route53, multi-region, IAM policies |

**Pros:** Scales to zero for low-traffic. Cognito handles auth out-of-the-box. CDK gives typed IaC. Secrets Manager integrates natively with ECS/App Runner.

**Cons:** Complexity ceiling is high — many services to wire together initially. App Runner cold starts for JVM (~5–10s).

---

### 2. GCP (Google Cloud Platform)

| Criteria | Assessment |
|----------|------------|
| **React hosting** | Firebase Hosting (CDN-backed static hosting, git-deploy) |
| **JVM backend** | Cloud Run (container, scales to zero) |
| **Secrets** | Secret Manager (encrypted, IAM-gated) |
| **Auth** | Firebase Authentication (Google sign-in, email/password, token-based) |
| **CLI** | `gcloud` CLI + `firebase` CLI |
| **IaC** | Terraform, Pulumi, Deployment Manager (less popular) |
| **Docs** | Good — Firebase has excellent getting-started guides; Cloud Run docs are clear |
| **Est. weekly cost** | ~$0–$1/week (Firebase Hosting free tier generous; Cloud Run free tier: 2M requests/month, 360k vCPU-seconds; Secret Manager $0.06/secret/month) |
| **Enterprise path** | Full GCP ecosystem — VPC, Cloud Armor, IAM, multi-region |

**Pros:** Cloud Run scales to zero perfectly for your use case. Firebase Auth is simple to integrate with React. Firebase Hosting deploys from CLI in one command. Cheapest option at your scale.

**Cons:** Firebase Auth less configurable than Cognito for complex flows. Fewer IaC options than AWS (Terraform works well though).

---

### 3. Azure

| Criteria | Assessment |
|----------|------------|
| **React hosting** | Azure Static Web Apps (integrated auth, git-deploy) |
| **JVM backend** | Azure Container Apps (scales to zero) |
| **Secrets** | Azure Key Vault (encrypted, RBAC-gated) |
| **Auth** | Built into Static Web Apps (Azure AD, GitHub, custom providers) |
| **CLI** | `az` CLI + `azd` (developer CLI for templates) |
| **IaC** | Bicep (native), Terraform, Pulumi |
| **Docs** | Good — quickstarts available, but navigation can be confusing |
| **Est. weekly cost** | ~$0.50–$2/week (Static Web Apps free tier; Container Apps scales to zero; Key Vault $0.03/10k operations) |
| **Enterprise path** | Full Azure ecosystem — VNET, Front Door, AD integration |

**Pros:** Static Web Apps has built-in auth (no separate service needed). Container Apps is simple. Bicep is concise IaC.

**Cons:** Azure AD auth is enterprise-oriented, can be overkill for personal use. JVM cold starts similar to others. Docs less approachable than AWS/GCP for indie developers.

---

### 4. Fly.io

| Criteria | Assessment |
|----------|------------|
| **React hosting** | Deploy as static Docker container or use separate CDN |
| **JVM backend** | Fly Machines (micro-VMs, can scale to zero with `auto_stop`) |
| **Secrets** | `fly secrets set` (encrypted, injected as env vars) |
| **Auth** | No managed auth — bring your own (e.g. self-hosted or third-party like Clerk/Auth0) |
| **CLI** | `flyctl` — excellent DX, deploy in one command |
| **IaC** | `fly.toml` config file, Terraform provider available |
| **Docs** | Good getting-started, less depth for advanced patterns |
| **Est. weekly cost** | ~$0–$1.50/week (free tier: 3 shared VMs; JVM may need 512MB+ RAM = ~$3.50/month if always-on, $0 if stopped) |
| **Enterprise path** | Limited — no managed auth, no native WAF, fewer compliance certs |

**Pros:** Simplest CLI experience. One command deploys. Good for containers. Secrets are trivial.

**Cons:** No managed auth (you'd need to self-host or pay for Auth0/Clerk). Less enterprise growth path. JVM memory requirements may exceed free tier.

---

## Comparison Matrix

| Feature | AWS | GCP | Azure | Fly.io |
|---------|-----|-----|-------|--------|
| Scales to zero (backend) | ✅ App Runner | ✅ Cloud Run | ✅ Container Apps | ✅ Machines |
| Managed auth | ✅ Cognito | ✅ Firebase Auth | ✅ Static Web Apps | ❌ BYO |
| Secrets management | ✅ Secrets Manager | ✅ Secret Manager | ✅ Key Vault | ✅ fly secrets |
| CLI quality | Good | Good | Good | Excellent |
| IaC options | CDK, CF, TF | TF, Pulumi | Bicep, TF | fly.toml, TF |
| Docs / getting started | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Est. weekly cost | $0.50–$2 | $0–$1 | $0.50–$2 | $0–$1.50 |
| Enterprise growth path | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ |

---

## Recommendation

**For your current use case (personal, low-traffic, cost-sensitive, good DX):**

**GCP (Firebase + Cloud Run)** is the best fit:
- Firebase Hosting: one-command deploy for React SPA, generous free tier
- Cloud Run: container-based, scales to zero, free tier covers your usage entirely
- Firebase Auth: drop-in React SDK, Google sign-in or email/password, token-based
- Secret Manager: cheap, simple API for your Play service to read API keys
- Terraform or `gcloud` CLI for IaC
- All in one GCP project

**If you value enterprise growth path and are comfortable with more upfront wiring:**

**AWS (Amplify + App Runner + Cognito)** is the strongest long-term choice at a small cost premium.

---

## Next Steps

1. Choose provider
2. Containerise the Scala Play service (Dockerfile)
3. Set up IaC project (Terraform or provider-native)
4. Configure auth for the React app
5. Store API keys in secrets service
6. Deploy and test from phone browser
