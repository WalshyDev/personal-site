----
title: MC's secret new text filtering
description: Mojang are silently working on text filtering, find out all about it!
----

# MC's new secret text filtering!

So, in 1.16.4 Pre Release 1 Mojang silently added a new option to `server.properties` this was `text-filtering-config`. Now, I was curious what this does so I set my sights on the code and dug in! I initially had a look at 1.16.5, I found the implementation (`net.minecraft.server.network.TextFilterClient`) and had a look through it. I quickly realised though this wasn't finished and didn't currently function. In addition, it had no API endpoints yet which it was sending data to. So, I decided to look at the snapshots! I diff'd between snapshots until I saw the endpoints get added! 21w07a worked on this implementation quite a bit and added the endpoints whoooo. I still diff'd up until 21w10a which at the time of writing is the latest snapshot.

Sadly, it was now half 2 in the morning so I decided I'd sleep and look into this more tomorrow.

Tomorrow came and I dug straight back into the code, I made myself a config for the text filtering and setup a very simple `express.js` server to capture the messages coming in so I could confirm it's what I expected. I could also just have a nicer look at the data and headers.

Result:

```js
::ffff:127.0.0.1 POST /v1/chat
{
  'content-type': 'application/json; charset=utf-8',
  accept: 'application/json',
  authorization: 'Basic YWFhYWFhYWE=',
  'user-agent': 'Minecraft server21w10a',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  host: 'localhost:8000',
  connection: 'keep-alive',
  'content-length': '138'
}
{
  rule: 1,
  server: 'test',
  room: 'Chat',
  player: 'f45cd935-7d4a-3527-9261-e4926d3ebb66',
  player_display_name: 'HumanRightsAct',
  text: 'a'
}
```

(side note, hey Mojang, please add a space after "server" in the User-Agent, kthx <3)

I wasn't actually returning anything here so I could see console complain that it wasn't getting a response. This is a good sign, it means they're also using the data I give back 😈

Now it's time to mess with the response! So, looking at the code I can see the response can have 3 values: `response`, `hashed` and `hashes`. If the `response` is false the message is sinked (not sent to any other users). If it is true, it then looks for a `hashed`. If that isn't in the JSON it lets the message through. If it is there, it then goes to the `hashes`

So, if I send `{"response": false}` to all messages this would mean none go through! If I send `{"response": true}` all messages go through.

So, that's pretty simple right? If the message has a bad word you respond with false and the message is sinked. But, what if you wanted to make it so they'd need to say 2 bad words to be sinked? Well, that's where the `hashes` field comes in to play. In the filtering config you define a `hashesToDrop` this sets the bar for how many `hashes` are needed in order to sink the message. So, if I set `hashesToDrop` to 2 and then returned a JSON like this:

```js
{
    "response": false,
    "hashed": "I said a bad word",
    "hashes": [
        "herobrine",
        "red"
    ]
}
```

then the message would be sunk because I specify 2 strings in `hashes` and my `hashesToDrop` config option is also set to 2. If I removed `red` and only had 1 string in the `hashes` array then the message would be replaced with "I said a bad word". This means you can filter out their bad word with \*s or something like that! Pretty cool!

I have put a simple NodeJS script on Pastebin that you can use to test this yourself with here: [https://pastebin.com/TjvzgYae](https://pastebin.com/TjvzgYae)

If you write "herobrine" and/or "blobs" it will star that out of your message (or drop depending on your config).

This was pretty fun to mess around with and definitely a nice feature, my only concern would be the privacy of this. You'd be sending every player join/leave, chat, book edit and probably more to Mojang (if they make themselves default). Now, the beauty is you can setup your own server like I did here. I can see people making a product out of this as well in the future. A web UI where you can set words and even regexs to match would be nice. Only Mojang know what the final result of this will be though! For now, there is no default config so it isn't sent anywhere!

Below I have put some notes on this. I hope I made it pretty clear what is happening and how. 

Here is an example of it in action :)

![Text filtering showcase](/img/text-filtering-showcase.png)

---

## Final notes:

Here is my `text-filtering-config` value: `{"apiServer":"http://localhost\:8000","apiKey":"aaaaaaaa","ruleId":1,"serverId":"test","hashesToDrop":2,"maxConcurrentRequests":1000}`

The `Authorization` header is just `Basic <base64-apiKey>`. You can base64 decode mine to verify it matches my config here! I assume this will be more secure in the future.

API Endpoints:

- POST `/v1/chat`
- POST `/v1/join`
- POST `/v1/leave`

If you return a 204 it will set the response as an empty JSON and use the default values. These currenly are:

- `response` → `false`
- `hashed` → `null`

due to the `response` being `false` by default this will sink any message sent. Mojang, pls make this `true` by default <3

There is code for book title and content however that is not currently sent

`/tell` is not currently filtered so someone could say no no words there