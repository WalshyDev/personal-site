---
title: AI has made development fun again
description: I've been using AI tools heavily for the past few months and it's genuinely made me enjoy building again. Here's how.
date: 2026-03-07
tweet: https://x.com/walshydev/status/2030359262078128426
---

I work a lot. After work I'm often too tired to sit down and actually write code. I've had projects I have wanted to build for ages but they would take a lot of time which I just did not have. The motivation to start something knowing it'll take weeks of evenings to finish just wasn't there. So things sat half done or never started at all.

That has changed.

## The shift

I've been playing with AI tools for quite a long time. I used GitHub Copilot when it first came out and it was _fine_ for autocomplete. Having it do anything more than that wasn't great but it worked well enough for what it was. I kept using it on and off but never fully invested in it as a real part of my workflow.

Later last year though, models got good enough to where we could really start cooking. I could have it confidently do work for me without needing a bunch of hand-holding and guiding. That was a game changer.

I started with work. I was using it to help me ship changes across multiple projects way faster than I could alone and as a result, we got a better platform out of it. I also started using it to build scripts and other random tooling I needed but never had time to sit down and write. Things that would've sat on my todo list for months were getting done in an afternoon.

Part of my job is context switching every 10 minutes, I don't have an uninterrupted 30 minutes nevermind an hour or two to sit down write some code, some tests and ship it. With AI, I set it off on its task, I come back whenever I have a second, do a review (often significantly faster than the real code would have taken) and ship it. 2 hours -> 5-10 minutes. That is where this has changed things for me.

## December

In December I took my end of year PTO and finally had time to sit down and make some projects I've wanted to build. I ended up shipping [Orb tools](/blog/orb-tools-modern-http-tooling) and a bunch of other random things. Claude Code and Opus 4.5 (latest at the time) helped me get Orb to what I wanted it to be and ship way faster than I could have on my own.

It wasn't as easy as just saying "build this" though. It took quite a few rewrites with me not being happy with the result. I ended up having to build the base myself and then having it ship the features from there. I generally haven't found I've needed to do this, usually I can write a detailed goal and have it write todos which it then goes through. However, for Orb it just couldn't do it so building out a base that did everything the way I wanted was the way. Then it followed my patterns, built as I wanted and shipped a good result. AI isn't perfect and this is a prime example of that.

The work on Orb got me excited again for the first time in a long time (depressing I know). I had fun building again and it was a blast to see the results come together so quickly. Since then I've rewrote this site, I could never do site design but luckily AI models are stupid good at that now. There's some other stuff I also have in the works and I'm finally finishing projects which have been half done for over a year. I love it.

## The Mac Mini setup

Anyway, hyping up AI aside. I wanted to also talk about something I did earlier this week. I did something others have been doing but not for exactly the same reasons. I bought a Mac Mini.

Mac Minis are great little machines that can just run in the corner of a room and do work. I'm not running [OpenClaw](https://github.com/openclaw/openclaw) on it like others. Instead, I'm using it to be lazy. I love having [Claude Code](https://claude.com/product/claude-code) or [Codex App](https://developers.openai.com/codex/app/) running and building stuff but it requires me being on my laptop or having it running on the side. I hate that. It's annoying. I want to just lay in bed, chill and have them work in the background. Now I can do that.

I bought it and quickly installed some basic tools. I then learnt Macs have a feature called [Screen Sharing](https://support.apple.com/guide/mac-help/screen-sharing-overview-mh14066/mac) which is extremely good for my use case. I can just connect to the machine from my Macbook Air and do anything, it's like [TeamViewer](https://www.teamviewer.com/) or [AnyDesk](https://anydesk.com/) but built directly into the OS and actually secure. I was thinking I'd need to just be SSHing in (which I do also have setup) but it's nice to not need that for everything.

So now I can quickly open up Screen Sharing, run a prompt and go back to chilling. Or have Claude Code running in [remote control](https://code.claude.com/docs/en/remote-control) already and just connect to it on my phone. The remote mode has been a bit buggy for me so far but it is a preview, I'm sure they'll make it great.

The one problem with me doing remote stuff from bed is that right now [Codex app](https://chatgpt.com/codex) does not support it. [They are working on it](https://x.com/ajambrosino/status/2030059146436091939) though and I am very hyped for that to ship. The Codex models (and seemingly [GPT 5.4](https://openai.com/index/introducing-gpt-5-4/)) are underrated by a lot of people. For me, they’re often a secondary model today, I default to Opus 4.6 for code and then have Codex do reviews or more complex tasks. Codex models are very thorough, which is something that cannot be said for Opus. Where Opus goes and does the quickest change to get a result, Codex takes the time to understand and generally come up with a better solution. I can see the latest OpenAI model become the default for me and others in the near future.

I'm still early in this new workflow but I'm already liking it. I've had Claude do _multi-hour_ long sessions before and it was so annoying having to keep my laptop open and running or worse, having to delay sleep waiting for it to finish. Now I just spin it up on the Mini and let it do its thing while I do other stuff.

So finally, AI has made development fun again for me. I can ship and better yet, I can ship from bed while I just watch Twitch like a nerd.

---

I want to make a small side note here. I'm aware AI is not perfect and I will be the first to say it is not the thing everyone should use for everything. I'm always very aware of the dangers of AI and have [talked about it before](https://x.com/WalshyDev/status/2006179706241220726) in terms of human connection.

AI still hallucinates, it still is very dumb at times, it still has very dangerous use cases. We've seen a lot of these in the AI space and we will sadly continue to see more. I am very aware of all of that and I am not trying to say otherwise. For development though, it has been a game changer for me and many others I know. It's all about finding the right balance. AI Labs also need to have proper guards in place to prevent these dangerous cases but without restricting the freedom of using these tools. It's a hard balance but I think the current state of things is pretty good.
