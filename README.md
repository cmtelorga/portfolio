# Lucas Lorga — Portfolio

Static site (HTML + CSS + JS, no build step). Two pages:

- `index.html` — landing page (photo, background, featured case, journey, contact, sources)
- `eyefriend.html` — EyeFriend case study with a left chapter panel (collapses into a menu on mobile)

Language: English by default, Portuguese via the EN/PT button (or `?lang=pt` in the URL).

## Publish on GitHub Pages

1. Create a public repository on GitHub, e.g. `lucaslorga.github.io` (gives you the address `https://lucaslorga.github.io`) or any name such as `portfolio` (address `https://lucaslorga.github.io/portfolio`). Use your GitHub username in place of `lucaslorga`.
2. Upload **all files from this folder** (keep the `assets` folder structure and the `.nojekyll` file) to the root of the repository: *Add file → Upload files*, drag everything, *Commit changes*.
3. Go to *Settings → Pages*. Under *Build and deployment*, choose *Deploy from a branch*, branch `main`, folder `/ (root)`, and save.
4. Wait 1–2 minutes and open the address shown on that page.

### After publishing
- Edit `og:image` in both HTML files to the full address, e.g. `https://lucaslorga.github.io/assets/img/og-image.jpg`, so LinkedIn shows the preview image.
- Add the site link to your LinkedIn (Contact info → Website, and the Featured section).
- Custom domain (optional): buy a domain, then set it in *Settings → Pages → Custom domain*.

## Editing text
Each text appears twice: `<span data-lang="en">…</span>` and `<span data-lang="pt">…</span>`. Edit both.
Citations are links like `[3]` pointing to the numbered list in the Sources section at the bottom of each page.
