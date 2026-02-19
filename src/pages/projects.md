---
layout: ../layouts/Prose.astro
title: Projects
description: Projects by WalshyDev
---

# My Projects

## Released

### Orb tools
The Orb tool collection is a set of useful tools I've needed, the most notable is [`orb-cli`](https://orb-tools.com/cli/overview/) which is a more modern cURL alternative. It has a much more user-friendly interface, built in JSON parsing and a lot more features. It's also open source and available on GitHub!

I blogged about the creation of `orb-cli`, `orb-client` and `orb-mockhttp` here: https://walshy.dev/blog/orb-tools-modern-http-tooling/

- [GitHub](https://github.com/WalshyDev/orb)
- [Documentation](https://orb-tools.com/cli/overview/)

### file-querier (fq)

file-querier (fq) is a jq-compatible CLI tool for querying and transforming structured data across multiple formats. Installed as `fq`. It was built for a need to query more than just JSON but not have other tools with different syntax. `jq` is fantastic but is currently limited to just JSON. `fq` supports JSON, CSV, YAML, TOML and YAML.

- [GitHub](https://github.com/WalshyDev/file-querier)

## In Development

## Past

### Firework (unreleased)
Firework is a very lightweight web framework for Java. Natively supports real ip headers, rate-limiting, middleware and more.

I've used Java to create REST APIs for a long time in and out of work, sadly no framework has fit my needs. I would like to not be creating a ton of util methods, wrapper classes, etc.

This framework is being created so I (and hopefully others) can have a much better (and quicker!) experience creating REST APIs using Java. Built in Rate Limiting, Response Caching, middleware, reverse proxy support and a lot more!

### Slimefun
Slimefun was a Minecraft plugin which aims to turn your Spigot Server into a modpack without ever installing a single mod. It offers everything you could possibly imagine. From Backpacks to Jetpacks! Slimefun lets every player decide on their own how much they want to dive into Magic or Tech.

Slimefun is an [open source](https://github.com/Slimefun/Slimefun4) project with over 200 contributors, over 7000 commits and a [Discord server](https://discord.gg/slimefun) with over 12,000 members!

**Stack:** Java, GitHub Actions

- [GitHub](https://github.com/Slimefun/Slimefun4)
- [Discord](https://discord.gg/Slimefun)

### FlareBot
A Discord bot made with JDA, FlareBot is a music and server administration bot along with a few other cool features. This bot was created in September 2016 and was eventually discontinued in April 2018.

FlareBot grew to almost 50,000 servers which in 2018 made it one of the biggest bots on the platform!

**Stack:** Java, NodeJS, MySQL, Cassandra, Redis, Prometheus, TravisCI

- [GitHub](https://github.com/FlareBot/FlareBot)
