---
title: Stop shipping AI files nobody reads
description: Everyone's racing to ship new "standards" for AI agents like llms.txt, auth.md, api-catalog, you name it. None of it gets used. Here's why it is not a benefit.
date: 2026-06-15
---

Every week there's a new "AI-ready" file or standard you're supposed to ship. [`llms.txt`](https://llmstxt.org/), [`auth.md`](https://workos.com/auth-md/docs/auth-md), [`/.well-known/api-catalog`](https://www.rfc-editor.org/rfc/rfc9727.html), [`ai.txt`](https://aitxt.ing/), and on, and on. New blog posts hyping them. New SEO tools generating them. New thought-leader threads telling you you're behind if you don't have one.

But, do these actually help? Are models actually using these? Well... the data says no.

## Nobody is actually reading these files

The numbers on `llms.txt` don't lie. [OtterlyAI ran a 90-day study](https://otterly.ai/blog/the-llms-txt-experiment/) measuring AI bot requests and found that out of **62,100** AI bot hits, exactly **84** went to `llms.txt`. That's 0.1%. The file performed _three times worse_ than an average content page on the same domain.

[Acquia's data](https://dri.es/markdown-llms-txt-and-ai-crawlers) is even worse. Across their entire hosting fleet they saw about **5,000** `llms.txt` requests out of **400 million** total. That's 0.001%. And nearly all of those were SEO tools, not model providers.

Cloudflare's Radar team [posted similar numbers](https://x.com/dbelson/status/1961113453713674250) from their own insight into global website traffic, minimal traffic and no major AI provider requesting these files.

And the kicker, [Ahrefs studied `llms.txt` files across their index](https://ahrefs.com/blog/llmstxt-study/) and found that **97% of them received zero traffic in May 2026**. Nothing fetched them at all. Not models, not crawlers, not even SEO tools. They just sit there.

## Google literally said it themselves

The [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) puts it about as plainly as you can:

> You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in generative AI search.

Google's John Mueller [went further on Reddit](https://www.reddit.com/r/TechSEO/comments/1k0kcx9/llmtxt_where_are_we_at/mnev9c0/), comparing `llms.txt` to the old `keywords` meta tag, a thing site owners claim about themselves that search engines have ignored for over a decade because it was instantly gamed. His exact words:

> AFAIK none of the AI services have said they're using LLMs.TXT (and you can tell when you look at your server logs that they don't even check for it). To me, it's comparable to the keywords meta tag - this is what a site-owner claims their site is about ...

Gary Illyes said the same at [Google Search Central Deep Dive in APAC](https://searchengineland.com/google-says-normal-seo-works-for-ranking-in-ai-overviews-and-llms-txt-wont-be-used-459422). Google doesn't support `llms.txt` and isn't planning to. Just do normal SEO.

If Google, the company that would benefit _most_ from a new markup spec because it would give them yet another signal to rank on, is telling you not to bother, that should tell you something.

Now, before I get a "but but" yes Google have contradicted this themselves in _other_ parts of the company. While Search is telling people to stop, the Chrome team [added an `llms.txt` audit to Lighthouse](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt) under a new "agentic browsing" category. This is kinda how it is at big companies, different orgs/departmants will have different ideas. The most important bit though is that regardless, Google (and other providers) do not use it.

## The providers don't care

For any of this to work, the model providers would need to actually do something with the files. Either bake support into training, system prompts, agent harnesses, or browse tooling. None of them have.

- **Anthropic**: They [refreshed their crawler docs in February 2026](https://ppc.land/anthropic-clarifies-what-its-three-web-crawlers-do-and-how-to-block-them/) splitting things into ClaudeBot (training), Claude-User (real-time queries), and Claude-SearchBot. All three respect `robots.txt`. None mention `llms.txt`.
- **OpenAI**: Their [GPTBot docs](https://platform.openai.com/docs/bots) cover `robots.txt` and IP ranges. Nothing about consuming `llms.txt`.
- **Google**: See above. Publicly told people to stop.
- **Moonshot, Mistral, Meta, xAI**: Same story. No public commitment, no documentation, no system prompt directive that says "look for `llms.txt` first."

And remember, these companies aren't really crawling the web in real time to learn things anymore. Frontier models train on frozen snapshots, not live web pulls. The training pipeline these days leans on licensed corpora ([OpenAI's Reddit deal](https://www.reuters.com/technology/reddit-signs-content-licensing-deal-with-openai-2024-05-16/), [xAI's $10B deal with Cursor](https://www.cnbc.com/2026/04/21/spacex-says-it-can-buy-cursor-later-this-year-for-60-billion-or-pay-10-billion-for-our-work-together.html) to feed real coding interactions into Grok, etc.), opted-in user data, synthetic data, and human-labeled feedback. Not "let's go scrape some random dude's marketing site and hope his `llms.txt` is up to date."

The funny part is the providers _do_ still crawl heavily. [Cloudflare Radar's data](https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/) shows Anthropic's ClaudeBot fetched **13,528 pages for every 1 human visit** it sent back in April 2026, and OpenAI's ratio was **1,276:1**. And on [June 5, 2026 Cloudflare's CEO posted](https://eciks.org/7350-28051-matthew-prince-bot-traffic-surpasses-human) that bot traffic finally crossed humans on the web at **57.5% bots, 42.5% humans**, driven mostly by agentic AI. So they're crawling more than ever. They're just pulling _the actual HTML_. Not your special file.

## Adoption is high, usage is near zero

Here's the bit that makes the whole thing feel like a marketing exercise. [SE Ranking surveyed 300,000 domains](https://seranking.com/blog/llms-txt/) and found a **10.13%** `llms.txt` adoption rate, roughly even across low, mid, and high traffic tiers. They also ran statistical and ML analysis on the data and found **no correlation between having an `llms.txt` and being cited by an LLM**. Of the 50 most AI-cited domains in their sample, exactly one had the file.

So ~30,000 of those sites are shipping a file that gets ~0.1% of AI bot traffic, doesn't move the needle on citations, and is served almost exclusively to SEO crawlers checking _whether you have the file_ rather than models reading it. That's not a standard.

The same pattern is playing out with all the other files/standards. Someone writes a proposal. X/Twitter goes wild. A few thousand sites add the file in a weekend. Nothing changes. The model providers keep doing what they were already doing.

## Make your site human-friendly, you get agent-friendly for free

Here's the actual answer, which is also the boring answer. Write clean HTML, use semantic markup, write content humans want to read.

When an agent fetches your page, it parses the same DOM a browser would. If a human can skim your docs and find what they need, so can a model. If your nav is sensible, headings make sense, and your content isn't buried in a single-page-app rendering nightmare, you're already optimised for agents. You don't need a second file.

Two versions of your site is an anti-pattern. It's more surface area, more drift, more things to forget to update. Six months from now your `llms.txt` is out of date, points at dead links, and contradicts your actual site. Cool, now you've made your "AI optimisation" actively worse than not having one.

If you _really_ want to do something agent-specific, the right shape is content negotiation, not a separate file. [Cloudflare's Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/) does this. When a request comes in with `Accept: text/markdown`, the edge converts your HTML on the fly and serves that. Same content, same source of truth, just rendered for whoever's asking. I tested the three mainstream CLIs:

- **Claude Code**: sends `Accept: text/markdown, text/html, */*`. Picks up the markdown version automatically.
- **Codex**: routes through OpenAI's `ChatGPT-User` bot, which sends a standard browser-style Accept header. No markdown preference today.
- **opencode**: its [native webfetch tool](https://opencode.ai/docs/tools#webfetch) sends `Accept: text/plain;q=1.0, text/markdown;q=0.9, text/html;q=0.8, */*;q=0.1`. Though by default for a one-off URL fetch it'll often just shell out to `curl`, which sends `*/*` and gets you nothing.

So one and a half out of three opt in, and only when the right tool is picked.

Honestly though, I'm not sure how much this matters in practice. The pitch is token reduction, and yes, a markdown version of the page is smaller than the HTML. But in a real agent session (multi-turn, tools, file reads, the whole stack) those savings are noise. Right now exactly one mainstream CLI even asks for it. So it's a fine thing to enable if you're on Cloudflare and it's a one-toggle deal, but I wouldn't put it on a roadmap.

## One thing that actually looks promising: WebMCP

I've spent this whole post dunking on agent-targeted standards. There's one I genuinely think is worth looking at though, [WebMCP](https://developer.chrome.com/docs/ai/webmcp).

The idea: instead of an agent scraping your DOM and guessing what to click, your page exposes typed, callable tools to the agent through `document.modelContext`. Want it to add something to a cart? Declare an `addToCart` tool with a JSON schema and the agent calls it like a function. Want it to fill a form? Annotate the form. The user gets confirmation prompts on the actions that matter.

That's a fundamentally different thing to the markdown manifests. It's not "here's a curated text version of my site." It's "here's an API surface, with real interface contracts." And tool use is exactly the thing agents are already good at. Every modern agent harness is built around calling typed tools with JSON schemas. WebMCP just lets your site _be_ one of those tools. It plays to the strength instead of asking the model to do something it isn't great at (reading a wall of marketing markdown and guessing what matters).

It's early. Chrome 149 origin trial started May 2026, W3C is still hashing the spec out, and [webmcp.cool](https://webmcp.cool/) lists the ~100 sites that have shipped tools. But it's the first agent-targeted standard where I look at it and go "yeah, an agent could do something real with this." The big tell, it's coming out of a browser team and a W3C working group, not an SEO Twitter post. The plumbing is going to be in the browser, not in your `/.well-known/`.

If you want to spend an afternoon making your site genuinely agent-friendly, this is the one I'd look at first.

## The boring stuff that already works

The rest of what genuinely helps agents is the stuff you should already be doing:

- Real semantic HTML. Headings, lists, links, alt text. The stuff you should be doing anyway.
- A working `robots.txt` if you want to allow or block specific AI crawlers ([Cloudflare's bot management UI](https://blog.cloudflare.com/declaring-your-aindependence-block-ai-bots-scrapers-and-crawlers-with-a-single-click/) makes this trivial).
- A sitemap so crawlers can find your pages.
- Don't hide content behind JS that needs a full browser to render. Render on the server when you can.

That's the list. There's no item 5 that says "ship a 200-line markdown manifest at `/llms.txt`."

## I'll change my mind when there's data

I want to be clear, I'm not anti-AI, I'm anti-hype. I write basically everything with [Codex & Claude Code](/blog/ai-has-made-dev-fun-again) these days. I love this stuff. I just think a lot of the "AI-ready" tooling that's getting pushed right now is marketing dressed up as a standard.

Show me real production traffic from a real model provider hitting `llms.txt` and acting on it differently than the HTML. Show me an Anthropic blog post saying "Claude now reads `llms.txt` on every browse." Show me an OpenAI system prompt that references it. Until any of that exists, the file is doing nothing for you.

If this does change in the future, cool. But, I honestly doubt it will. There's just no benefit. The biggest benefit I can see is serving the same content as Markdown to save a bit on tokens (but that really isn't a big deal for a site fetch) and that's it. Doing a special markdown file just doesn't seem good or feasible. If your site isn't good for agents, it also isn't good for humans. The fix is just making your site good for humans.

---

If you want to ship one of these files, go for it. It's a few minutes of work and it isn't actively harmful. Just go in with realistic expectations about what it's doing for you today. And if you've got data that contradicts any of this (actual traffic, actual model behavior, actual provider commitments) [send it to me](https://x.com/walshydev). I'd genuinely love to be wrong.
