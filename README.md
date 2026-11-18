# Anointed Vision Ministry | CMS Version 5

This is the complete AVM website with content editing support for photos, videos, events, and a featured homepage photo. It preserves the church branding, pastor biography, mission, vision, giving placeholder, and Sunday worship details.

## What is ready now
- New public pages: `gallery.html`, `sermons.html`, `events.html`
- Homepage upcoming events automatically populated from content
- Browser-based Pages CMS schema in `.pages.yml`
- JSON content files (`content/*.json`), initially empty for photos, videos, and events
- No login form is included in the public website. Editing happens at https://app.pagescms.org, using GitHub authentication.

## IMPORTANT: Publishing requires GitHub-connected Netlify deployment
The existing Netlify project was created via manual ZIP upload. DO NOT just upload this folder and expect CMS edits to auto-publish. To enable automatic updates:

1. Create a PRIVATE GitHub repository in an account controlled by the church or the technical administrator; name it `avm-website`.
2. Add all files in this folder to the ROOT of the repository, including `.pages.yml`. In VS Code open a terminal and run:
   git init
   git add .
   git commit -m "Add AVM website and Pages CMS"
   git branch -M main
   git remote add origin https://github.com/YOUR-GITHUB-USERNAME/avm-website.git
   git push -u origin main
   (Create the empty repo first; Git and GitHub credentials required.)
3. In Netlify, create a NEW Git-based project from the repository (recommended for initial migration to avoid overwriting the current preview). Build command: NONE. Publish directory: `.` (repository root). Confirm that all public pages and media load on the NEW preview URL.
4. In https://app.pagescms.org sign in with GitHub, install the GitHub App for this repository, and open it. You should see Homepage Featured Photo, Church Photo Gallery, Worship Services & Sermons, and Church Events & Flyers.
5. For Pastor Sanders to sign in, he needs his own GitHub login, access to the repo, and Pages CMS App access. Do NOT share credentials. Be aware: GitHub collaborators with write access could also edit code via GitHub itself. For true content-only permissions, move to a CMS with separate editor roles and stronger repo isolation.
6. Test one unpublished photo or event, then set `published: true` and save. Confirm GitHub receives the change and Netlify builds and publishes it. Only then share the editing workflow with Pastor Sanders.
7. Once approved, switch the domain to the Git-connected project. Keep the old manually deployed site intact until then.

## Editor instructions for Pastor Sanders
- Visit https://app.pagescms.org and sign in with the church-authorized GitHub account.
- Choose the `avm-website` repository.
- Choose **Church Photo Gallery** to add title, photo, caption and switch **Show on website** on.
- Choose **Worship Services & Sermons** to paste a YouTube URL for a service (upload large videos to YouTube, not the repository).
- Choose **Church Events & Flyers** to add event date in `YYYY-MM-DD` format, event information, and an optional flyer. Only future events show on website; the homepage shows up to 3.
- Choose **Homepage Featured Photo** to replace the leadership section photo and heading.
- Save in Pages CMS. The GitHub-connected Netlify build then updates public content. This is not instant; check Netlify Deploys for completion.

## Local testing
Because `fetch()` may be blocked by browsers when opening HTML as `file://`, start a local HTTP server from this folder in VS Code terminal:
`python -m http.server 8000`
Then open http://localhost:8000. Ctrl+C stops the server.

## Editorial notes
- Giving information remains unverified and inactive. Do not publish Cash App or Zelle account details until verified.
- Please obtain permission before publishing congregants' photos, especially children's images.
- You may wish to use GitHub branch protection and backups. GitHub write access is not limited to content by Pages CMS.
- Do not embed untrusted HTML in editable fields.
- The homepage featured photo is the leadership-section photo, not the church emblem.
