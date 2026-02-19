---
title: Orb tools - modern HTTP tooling in Rust
description: I built a set of HTTP tools because curl wasn't cutting it for my needs. Here's what they are and why they exist!
date: 2026-02-19
---

## The problem

At work I deal with HTTP a lot and in all forms. I need to test things over HTTP/1.1, HTTP/2, HTTP/3, WebSockets, with different compression algorithms, etc. cURL is awesome, I've used it forever and continue to do so. But it doesn't support HTTP/3 or zstd out of the box. You need to manually build it, this is _fine_ but annoying to deal with. On top of that, cURL doesn't support WebSockets at all. I need `ws://` and `wss://` connections for my job and having to reach for a completely different tool every time was getting annoying.

So I thought, why not just build something that does all of this natively?

## orb-cli

[orb-cli](https://orb-tools.com/cli/overview/) is a command-line HTTP client built in Rust. You can grab it from [orb-tools.com](https://orb-tools.com/getting-started/installation/) with pre-built binaries for macOS, Linux, and Windows. Or build from source if you're into that (you'll need Rust 1.90+ nightly). It's basically what I wished cURL was for my use case. HTTP/1.1, HTTP/2, HTTP/3 (QUIC), WebSockets and zstd all work out of the box.

I kept the interface familiar though. If you know cURL, you know orb. Same `-H` for headers, `-d` for data, `-X` for method, `-o` for output. I didn't want to learn a new interface, I just wanted the protocols to work.

Here's what it looks like in practice:

Simple GET:
```bash
orb https://example.com/api/users
```

POST some JSON:
```bash
orb https://example.com/api/users -X POST --json '{"name": "Alice"}'
```

Force HTTP/3:
```bash
orb https://www.cloudflare.com --http3
```

WebSocket connection:
```bash
orb wss://test.walshy.dev/ws --ws-message '{"type": "echo", "content": "Hello!"}'
```

The `--json` flag is a nice shorthand I added because I was tired of typing `-H "Content-Type: application/json" -d '...'` every time. It just sets the content type and accepts header for you. While some things can handle a json body and the default content type when using `-d` standalone (application/x-www-form-urlencoded) a lot also doesn't and will _require_ the json flag to be handled as json.

Here's a quick comparison with cURL:

| Feature             | orb | cURL                  |
|---------------------|-----|-----------------------|
| HTTP/1.1            | Yes | Yes                   |
| HTTP/2              | Yes | Yes                   |
| HTTP/3              | Yes | Custom build required |
| WebSocket           | Yes | No                    |
| zstd                | Yes | Custom build required |
| brotli              | Yes | Yes                   |
| gzip/deflate        | Yes | Yes                   |
| Cookie jar          | Yes | Yes                   |
| mTLS                | Yes | Yes                   |
| Proxy (HTTP/SOCKS5) | Yes | Yes                   |

You can check timing info with `-w` which is super useful for debugging latency:
```bash
orb -w https://example.com
```

Or verbose mode with `-v` to see the connection and all the headers:
```bash
orb -v https://example.com
```

## orb-client

To build the CLI I needed a proper HTTP client library underneath that could actually handle all my needs while also allowing me to get the verbose data I needed. Initially, this was built on [reqwest](https://github.com/seanmonstar/reqwest) (and then briedly with hyper) which was great but it didn't allow me as much visibility into the connection/request details as I needed.

So [orb-client](https://github.com/WalshyDev/orb/tree/main/packages/orb-client) was born. It provides the HTTP/1.1, HTTP/2, HTTP/3, and WebSocket implementations that orb-cli uses. HTTP/1.1 and HTTP/2 are powered by hyper, HTTP/3 uses quinn/h3 for QUIC, and WebSockets go through tokio-tungstenite.
To get the details I need for verbose, it also has an [event based system](https://github.com/WalshyDev/orb/blob/main/packages/orb-client/src/events.rs) which you can listen to for connection/request events.

It's currently internal and not published to crates.io but here's what using it looks like:
```rust
use orb_client::{HttpClient, RequestBuilder, Url};
use std::time::Duration;

let client = HttpClient::builder()
    .connect_timeout(Duration::from_secs(10))
    .build();

let response = RequestBuilder::new(
    Url::parse("https://example.com").unwrap()
).send(&client).await?;

println!("Status: {}", response.status());
println!("Body: {}", response.text().await?);
```

It uses a builder pattern as well and as mentioned, has an event based system so it's pretty easy to extend. There's also DNS override support which is useful for testing against specific backends (this was needed to provide the --connect-to feature in the CLI).

## orb-mockhttp

Now naturally, I needed to test orb-cli and orb-client. I was using [httpmock](https://docs.rs/httpmock/latest/httpmock/) but ran into the same problem as cURL - it doesn't support HTTP/3. Additionally, for TLS testing it was all or nothing, you either had TLS on everything or nothing. I needed more granular control.

So I built [orb-mockhttp](https://orb-tools.com/mockhttp/overview/). It's a mock HTTP server library for Rust that supports HTTP/1.1, HTTP/2, HTTP/3, and WebSockets. It even handles automatic self-signed certificate generation for HTTPS testing per server.

Here's what it looks like:
```rust
use orb_mockhttp::TestServerBuilder;

let server = TestServerBuilder::new().with_tls().build();

server.on_request("/api/users")
    .expect_method("GET")
    .respond_with(200, r#"{"users": []}"#);
```

You can match on path, method, headers, body, whatever you need. Configure status codes, custom headers, response delays for timeout testing, all of it.

The key thing is the protocol support. Need to test that your client handles HTTP/3 correctly? Spin up a mock server with HTTP/3. Need to test WebSocket connections? It does that too. Need TLS on HTTP/2 but not HTTP/1.1? You can do that. The flexibility here is what I was missing from other mocking libraries.

It uses a builder pattern so it's pretty intuitive:
- HTTP/1.1 over TCP with optional TLS
- HTTP/2 over TCP with required TLS
- HTTP/3 over QUIC/UDP with required TLS
- WebSockets over TCP with optional TLS

You can also verify that your application made the right number of requests, sent the correct headers, and sent the correct body data. Pretty standard stuff but it's all there.

If you wish to also use mockhttp, you can add it to your `Cargo.toml`:
```toml
[dev-dependencies]
orb-mockhttp = "0.1"
```

## How it grew

The funny thing is, this all started as just the CLI. I needed a better cURL alternative for my day job. But to build a good CLI you need a good HTTP client library underneath. And to properly test that client library you need a mock server that actually supports the same protocols. So orb-cli turned into the orb-client library, which needed orb-mockhttp for testing, and suddenly I had a whole suite of tools.

That's kind of how it goes though. You start solving one problem and realise you need to solve three others first. At least now all these tools exist and other people can use them too.

Check out the [GitHub repo](https://github.com/WalshyDev/orb) and the [docs](https://orb-tools.com/) for more. If you have any issues or feature requests, throw them on GitHub.
