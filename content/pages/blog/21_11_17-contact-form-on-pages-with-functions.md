# Contact Form on Pages with Functions

This blog post will go over a few things:
* What is Pages
* What are functions
* How to make a contact form
* Testing & Deploying

If you are already in know about Pages and Functions then you can [click here](#How-to-make-a-contact-form) to skip over the introduction

## What is Pages?
Cloudflare Pages is a product for you to host static websites easily and for free (500 builds/month free plan - no bandwidth limits!). If you have a Jamstack (JavaScipt, API and Markup) website then this is the perfect service for you.

Now, you may be asking, why Pages over [Netlify](https://www.netlify.com/), [GitHub Pages](https://pages.github.com/) or another service? Well, I'm glad you asked! Cloudflare has a network of over 250 datacenters all around the world and all of them can serve _your_ website ([Network Map]()). This means that your website is within 50ms of 95% of the globe 🤯. If you're like me and you're a performance nut, that is pretty god damn awesome.

Alongside their network you also get the other benefits of Cloudflare, security, reliability and of course even more performance improvements.

## What are functions?
Functions are a way to run serverless code in front of your Pages project. If you know about [Workers](https://workers.dev), Functions are the same but built right into Pages. Some use cases of functions are:
* Fetch data from an API
* Adding contact forms
* Adding payments
* A/B testing
* Dynamic [OpenGraph](https://ogp.me/) tags
* Pulling data from a database (or even Airtable)
And a lot, lot more.

## How to make a contact form


## Testing & Deploying
If you're not new to Pages then you will understand the trouble of testing this locally, well no more! [Pages CLI]() has now been released so you can easily test your website **and** your functions!

