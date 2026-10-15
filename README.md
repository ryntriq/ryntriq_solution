# RYNTRIQ website

A responsive, bilingual static website for RYNTRIQ Solution. It uses the supplied RYNTRIQ symbol and colour palette, a Google Sans family for Latin text and Noto Sans Bengali for Bengali, with no database or build step.

## Pages

- `index.html` — Home, studio overview, animated service cards and concept previews
- `services.html` — Services overview with separate detail links
- `service-web.html` — Website design and development
- `service-data.html` — Data entry, cleanup, deduplication and matching
- `service-automation.html` — Custom tools for repetitive tasks
- `work.html` — Clearly labelled concept demonstrations and category filters
- `about.html` — RYNTRIQ purpose and working principles
- `contact.html` — Email, WhatsApp and enquiry form
- `message-sent.html` — FormSubmit return page

## Contact details and form

Email: `ryntriq@gmail.com`  
WhatsApp: `01977835719` (international link: `+8801977835719`)

There is no database. On a `file://` preview, submitting the contact form opens a prepared email in the visitor's mail app; the visitor still presses Send. On a web server, the form submits through FormSubmit AJAX and stays on the contact page, showing a branded loading state followed by an animated success or recovery view. A floating WhatsApp button appears on every page, with the Facebook page linked in the footer. The site owner must activate the address from FormSubmit's first verification email before live delivery works. FormSubmit says it forwards queued submissions after activation and stores them for up to 30 days.

## Preview and publish

Open `index.html` in a browser. Static hosting such as GitHub Pages can serve the site without a backend. Keep all HTML pages, `styles.css`, `script.js` and the `assets/` folder together when publishing or sharing the ZIP.

## Honest portfolio note

The work previews are explicitly marked concept demonstrations made for this site. They are not presented as RYNTRIQ client projects or measured business results.

