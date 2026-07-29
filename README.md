# TheGrowthCo. — website

Static site (HTML/CSS/JS) hosted on GitHub Pages.

## Structure

```
/
├── index.html, about.html, services.html, packages.html, contact.html
├── seo.html, performance-marketing.html, social-media.html,
│   website-development.html, creative.html
├── blog/index.html          Blog listing (rendered from data/blogs.json)
├── includes/
│   ├── header.html          Sitewide header — edit once
│   ├── footer.html          Sitewide footer — edit once
│   └── header-loader.js     Injects header/footer + nav behaviour
├── css/styles.css           Sitewide styles
├── css/blog.css             Blog-only styles
├── js/main.js               Page behaviour (scroll reveal, contact form)
├── js/blog.js               Blog listing renderer
├── data/blogs.json          Blog post list
├── images/                  logo/, blog/, services/, icons/, team/, favicons
├── robots.txt, sitemap.xml
```

## Editing the header or footer

Edit `includes/header.html` or `includes/footer.html` once — every page updates.
All links inside them are root-absolute (`/about.html`), so they work from any
folder depth, including `/blog/`.

## Adding a new page

1. Copy an existing page (e.g. `about.html`) and update the `<head>` text.
2. Keep these four lines intact:

```html
<div id="header-placeholder"></div>
<div id="footer-placeholder"></div>
<script src="/includes/header-loader.js" defer></script>
<script src="/js/main.js" defer></script>
```

3. Add the URL to `sitemap.xml`.

## Publishing a blog post

1. Add an entry to the `posts` array in `data/blogs.json` (copy the shape shown
   in the `_example` key: slug, title, category, excerpt, author, date,
   readTime, image, featured).
2. Create the article page at `blog/<slug>.html`.
3. Optionally drop the post image in `images/blog/`.

The blog listing, the featured post and the category filter are generated
automatically. With no posts, the page shows an "Articles coming soon" state.

## Local preview

Open a terminal in this folder and run:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000 — a server is required because the header and
footer are fetched at runtime (opening the files directly won't load them).
