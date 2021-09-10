-----
title: Handling File Uploads with Cloudflare Workers
description: This is a tutorial of using the File API to handle file uploads on Cloudflare Workers
-----

**Note:**
> This tutorial won't be going into how Workers work or what they are exactly, I plan to have a blog post on this in the future.

## Prerequisites

- A command line
- Wrangler
- A few minutes to spare

If you want to expand on this then you may also want a bucket (A B2/S3/other bucket not KFC bucket... though if you've got KFC gimme!)

## Setting up the project

Firstly, we need to setup the project. For this we will need the `wrangler.toml` (project file for Wrangler), `package.json` and the JS file we'll work on (I usually make this `index.js`)

We can run the following commands to set this up quickly:

```bash
$ npm init
$ wrangler init
$ touch index.js
```

We just need to edit the `wrangler.toml` to have our `account_id`, `zone_id` and our `route`. You can find your account ID and zone ID [in the zone dashboard](https://dash.cloudflare.com/:account/:zone) on the side.

In the end it should look like this:

```bash
name = "file-upload-tutorial"
type = "javascript"
account_id = "4e599df4216133509abaac54b109a647"
zone_id = "8d0c8239f88f98a8cb82ec7bb29b8556"
route = "example.com/image-upload"
compatibility_flags = []
workers_dev = false
```

## Compatibility flags!

Now we have set the project up we're on to the key ingredient. You may have found old posts relating to this and seen that there was no native [File API](https://developer.mozilla.org/en-US/docs/Web/API/File). This meant it was handled through strings and just wasn't a great experience. Well, not anymore!

Compatibility flags (Released 30th July 2021 - Wrangler v1.19.0) allow for the parser to follow browser spec. So, to do this we will want to add `compatibility_flags` and `compatibility_date` to `wrangler.toml`. We will add the flag `formdata_parser_supports_files` which as the name indicates allows the parser to support files! For the `compatibility_date` we will just point to today (Formatted in "international standard" or ISO 8601). Our `wrangler.toml` should now look like this:

```toml
name = "file-upload-tutorial"
type = "javascript"
account_id = "4e599df4216133509abaac54b109a647"
zone_id = "8d0c8239f88f98a8cb82ec7bb29b8556"
route = "example.com/image-upload"
# The needed parts for compatibility
compatibility_flags = [ "formdata_parser_supports_files" ]
# This date should be set to today while you're developing.
# This may cause a different runtime so best to only change
# when you're developing and confirm it works.
compatibility_date = "2021-09-09"
workers_dev = false
```

## Handling the upload

Now we go on to the actual code part. When a user uploads an image this will be done as part of form data. This means that we want to parse the form data being received by the Worker so that we can handle the file. From this [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) we will get a [File](https://developer.mozilla.org/en-US/docs/Web/API/File), with this we can get the MIME type, name, size and of course, the contents!

Assuming you already have the skeleton code we will start by parsing the form data that has been sent. This can be done with [Request#formData](https://developer.mozilla.org/en-US/docs/Web/API/Request/formData) like so (remember to await this!):

```js
async function handleRequest(request) {
  const formData = await request.formData();
}
```

Now we have a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) we need to get the [File](https://developer.mozilla.org/en-US/docs/Web/API/File). We can do this by fetching the specific thing from FromData, I'm going to use the key `file` but it could be anything so make sure this points to the key you're using! Anyway, we can fetch it like so:

```js
async function handleRequest(request) {
  const formData = await request.formData();
  const file = formData.get('file');
}
```

and that's it! We now have a [File](https://developer.mozilla.org/en-US/docs/Web/API/File)! So, let's just test this and you can build something with it.

To test let's just print out a JSON with the name, type, size and a SHA-1 hash of the file. We can do this like so:

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Parse the request to FormData
  const formData = await request.formData();
  // Get the File from the form. Key for the file is 'image' for me
  const file = formData.get('file');

  const hash = await sha1(file);

  return new Response(JSON.stringify({
    name: file.name,
    type: file.type,
    size: file.size,
    hash,
  }));
}

async function sha1(file) {
  const fileData = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-1', fileData);
  const array = Array.from(new Uint8Array(digest));
  const sha1 =  array.map(b => b.toString(16).padStart(2, '0')).join('')
  return sha1;
}
```

And let's test with a cURL (obviously use your worker url here)

```bash
$ curl -X POST -F 'file=@/home/user/images/example.png' https://worker-name.example.workers.dev
{"name":"example.png","type":"image/png","size":30283,"hash":"17946ec18d7b80f31e545acbc8baeb6294e39adc"}
```

Awesome! It works! :)

## Building B2 Image Uploader

Now I got the image uploading working I wanted to build a B2 image uploader. I wont go through the whole process of that but it's pretty simple.

- Accept POST request
- Check KV for auth/upload details
    - If they don't exist then call `b2_authorize_account` to get the auth details and then call `b2_get_upload_url` then store the auth and upload details in KV
    - If they do, pass them on
- Get the file extension and generate a UUID (`crypto.randomUUID()`) to make the file name
- Hash the file with SHA-1
- Upload to B2 with the upload URL we got earlier
- Return the file name and the downloadable URL
- Done :)

You can find my code for this here: https://pastebin.com/0gnxKwQf

And see me testing it here:
```bash
$ curl -X POST -F 'image=@/home/walshy/images/resolved.png' https://file-upload-tutorial.walshy.workers.dev
{"message": "Uploaded!", "file": "87bf9684-5d01-4d98-b9b6-f6a038661b4a.png", "b2Url": "https://f002.backblazeb2.com/file/worker-file-upload/87bf9684-5d01-4d98-b9b6-f6a038661b4a.png"}
```

and to prove it works, I will embed it here and you can visit the URL yourself: [https://f002.backblazeb2.com/file/worker-file-upload/87bf9684-5d01-4d98-b9b6-f6a038661b4a.png](https://f002.backblazeb2.com/file/worker-file-upload/87bf9684-5d01-4d98-b9b6-f6a038661b4a.png)

<image src="https://f002.backblazeb2.com/file/worker-file-upload/87bf9684-5d01-4d98-b9b6-f6a038661b4a.png" alt="Image of a Discord embed - this is the image I uploaded" />