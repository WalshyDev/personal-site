# Contact Form on Pages with Functions

This blog post will go over a few things:
* What is Pages
* What are functions
* How to make a contact form
* Testing & Deploying

If you are already in know about Pages and Functions then you can [click here](#How-to-make-a-contact-form) to skip over the introduction

## What is Pages?
Cloudflare Pages is a product for you to host static websites easily and for free (500 builds/month free plan - no bandwidth limits!). If you have a Jamstack (JavaScipt, API and Markup) website then this is the perfect service for you.

Now, you may be asking, why Pages over [Netlify](https://www.netlify.com/), [GitHub Pages](https://pages.github.com/) or another service? Well, I'm glad you asked! Cloudflare has a network of over 250 datacenters all around the world and all of them can serve _your_ website ([Network Map](https://cloudflare.com/network)). This means that your website is within 50ms of 95% of the globe 🤯. If you're like me and you're a performance nut, that is pretty god damn awesome.

Alongside their network you also get the other benefits of Cloudflare, security, reliability and of course even more performance improvements.

## What are functions?
Functions are a way to run serverless code in front of your Pages project. If you know about [Workers](https://workers.dev), Functions are the same but built right into Pages. Some use cases of functions are:
* Fetch data from an API
* Adding contact forms (hey, that's this blog!)
* Adding payments
* A/B testing
* Dynamic [OpenGraph](https://ogp.me/) tags
* Pulling data from a database (or even Airtable)
* Comment system
And a lot, lot more.

## How to make a contact form

### Making our form

Let's start with a simple contact form.
```html
<form method="post" action="/api/contact">
    <div>
        <label for="name">Name</label>
        <input name="name" required />
    </div>
    <div>
        <label for="message">Message</label>
        <textarea name="message" cols="50" rows="4" maxlength="2000" wrap="soft" required></textarea>
    </div>

     <div id="hcaptcha" class="h-captcha" data-sitekey="SITE_KEY" data-theme="dark"></div>

    <button type="submit">Send</button>
</form>
```

The main part of this form is the `method` and `action` attributes. These define _how_ we send this to our function. Since we're sending a `POST` to `/api/contact` it means that's where our function will be mapped to.

We're also protecting this form with [hCaptcha](https://hcaptcha.com/). This is a simple way to protect your website from spam. In our function we will validate that it's valid. Make sure you have a [site key](https://hcaptcha.com/signup) for your website.

(I have an example repository here if you want the full code: <INSERT LINK AHHHHH>)

### Making our function

Now that we have a form, we can make our function. To do this we will create a `functions` folder in the root of our project. Here is my project structure as an example:
<!--![Project Structure](/img/pages-functions/pages_functions_structure_functions_dir.png)-->
![Project Structure](../../../public/img/pages-functions/pages_functions_structure_functions_dir.png)

Now we have that directory, we want to make our function. Since we're mapping our function to `/api/contact` we want to create our function in the `/functions/api` folder and name it `contact.js`
> Fun fact: TypeScript works here too, just name it `contact.ts` if you want to use that

Routing is automatically done with any files created in the `functions` folder. So, if you made a file named `new.js` under `/functions/test` you would then be able to call `/test/new` in your website. For more info on this view here: <PAGES DOCS>

With that file created, this is how our directory structure looks like now:
<!--![Project Structure](/img/pages-functions/pages_functions_structure_fnc_api_contact.png)-->
![Project Structure](../../../public/img/pages-functions/pages_functions_structure_fnc_api_contact.png)

// Talk about how Workers and functions differ in code

// Example of form request

// Content of Worker

// Going through some of the code

// In action (gif?)

## Testing & Deploying
If you're not new to Pages then you will understand the trouble of testing this locally, well no more! [Pages CLI]() has now been released so you can easily test your website **and** your functions!

