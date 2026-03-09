---
title: Managed gradual deployments for Cloudflare Workers
description: Cloudflare Workers has gradual deployments but nobody uses them because it's a pain. CanaryRoll fixes that.
date: 2026-03-08
tweet: https://x.com/walshydev/status/2030773568309522800
---

Have you ever deployed a change to your Worker and broken production? Yeah... I think we all have. You push a change, it goes out to 100% of traffic immediately and then everything is on fire before you even take a drink. It's not great.

Cloudflare actually has a really great feature to prevent this called [Gradual Deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/gradual-deployments/). The idea is simple: instead of shipping to 100% immediately, you roll out to a small percentage of traffic first, make sure things are good, then keep going. Canary deployments. It's a well established pattern and Cloudflare has it built right into Workers.

The problem? It's very under-used. Cloudflare doesn't have a natively managed way to actually use it. You need to build your own system around the API to handle progressions, rollbacks, health monitoring, all of it. That's _fine_ if you want to hook it into some complex existing deployment pipeline you already have. Less so for everyone else who just wants safe deployments without building a whole platform first.

## CanaryRoll

This is where [CanaryRoll](https://canaryroll.com) comes in. It's the first managed platform to do Cloudflare gradual deployments. Login, add your Workers, and you can start doing gradual releases. They can even be backed by health checks (recommended).

No building your own orchestration. No writing custom scripts to poll the API and bump percentages. Just tell it how you want to roll out and it handles the rest.

Some of the things it supports:

- **Teams based** — your whole team can join the platform, not just one person's API token
- **Roles** — read only, deploy permissions, or admin. Pretty standard stuff but it's there
- **Custom release plans** — roll out your Workers however you want. 1% -> 10% -> 50% -> 100%, or whatever pattern makes sense for you
- **Health based rollouts** — we check your Worker's analytics to make sure it's stable while rolling out. If error rates spike, we automatically roll back. No staring at Grafana
- **Fully automated deployments** — releases shouldn't need humans pushing buttons. You can fully deploy without needing to do a thing
- **Notifications** — get notified when releases are made, progressed, rolled back, or complete. Slack, Discord and Google Chat all supported today. Fully configurable what events you want to send
- **Audit log** — see who did what and when

## How it works

It's built on Cloudflare's own stack which I think is pretty cool. Workers for the app itself, [Durable Objects](https://developers.cloudflare.com/durable-objects/) for release orchestration, [D1](https://developers.cloudflare.com/d1/) as the backing database, [Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) for analytics, and the upcoming [Email Sending](https://blog.cloudflare.com/email-service/) for email notifications.

When you create a release, we spin up a Durable Object instance for it. From there it handles everything. Health checks run on a defined interval using [Durable Object alarms](https://developers.cloudflare.com/durable-objects/api/alarms/). When the soak period is up, it automatically progresses to the next stage. If health checks fail 3 times in a row, it rolls back. We do 3 failures to avoid a little blip causing a rollback of the full release.
The DO also handles notifications, audit logging, and all the other bits. Or if you want full manual control, you can still have that and the DO just handles the deployment mechanics for you.

The nice thing about using Durable Objects here is that each release is its own isolated instance. It has its own state, its own alarms, its own lifecycle. Releases don't interfere with each other and the orchestration logic is clean because of it.

## GitHub Action

You probably don't want to be going to a dashboard every time you push code. So there's a [GitHub Action](https://github.com/WalshyDev/canaryroll-action) that plugs right into your existing workflow. Upload your new version with Wrangler, then hand the version ID to CanaryRoll and it creates the release for you.

Here's what that looks like:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Upload new version
        id: deploy
        run: |
          OUTPUT=$(npx wrangler versions upload 2>&1)
          VERSION_ID=$(echo "$OUTPUT" | grep -oP 'Version ID:\s*\K[a-f0-9-]+')
          echo "version-id=$VERSION_ID" >> "$GITHUB_OUTPUT"
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

      - name: Gradual rollout
        uses: canaryroll/action@v1
        with:
          api-token: ${{ secrets.CANARYROLL_TOKEN }}
          team-id: ${{ vars.CANARYROLL_TEAM_ID }}
          worker-id: ${{ vars.CANARYROLL_WORKER_ID }}
          version-id: ${{ steps.deploy.outputs.version-id }}
          name: ${{ github.sha }}
```
(currently, wrangler-action does not support getting the version id as an output. I'm prodding on this but for now, manually do the upload)

By default it creates the deployment in a `pending` state so you can start it from the dashboard when you're ready. If you want it to kick off immediately, set `auto-start: true`. You can also pass a `plan` if you want to use a specific rollout plan instead of the Worker's default.

The action gives you back a `release-id`, `release-url`, and `status` as outputs so you can use them in later steps. There's a `wait` option too if you want the action to block until the rollout finishes, but honestly just use the notification channels instead — no point keeping a runner alive for potentially hours.

For auth, you'll want a team API token (the `crt_*` ones) stored as a GitHub secret. You can create those in the CanaryRoll dashboard under Team Settings.

## Dogfooding

I've been dogfooding this over the last couple of days and it's been really useful. Not just for finding bugs but for improving the experience of the whole flow and UI. A lot of changes came from me using it and going "ugh, I wish this did xyz." That feedback loop of actually _using_ the thing you're building is always worth it.

## Things to know

A couple of notes if you're getting started with gradual deployments:

- **Secrets** — if you're using `wrangler secret put` or the Wrangler GitHub Action to manage secrets, you'll want to switch to `npx wrangler versions secret put` instead. This creates a new version with the updated secret without deploying it. Your next version upload will inherit those secrets and can be rolled out gradually as normal — updating your code and secrets together.
- **Durable Objects** — if your Worker uses Durable Objects, gradual deployments work a bit differently. Make sure to read [Gradual Deployments for Durable Objects](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/gradual-deployments/#gradual-deployments-for-durable-objects) to understand how traffic splitting works with DOs.

---

If you're deploying Workers to production and aren't using gradual deployments, you probably should be. And if the reason you're not is because it's too much work to set up, [CanaryRoll](https://canaryroll.com) is exactly what you need. Go check it out.

Not super ready to open source this project yet but I expect I will in the future.
