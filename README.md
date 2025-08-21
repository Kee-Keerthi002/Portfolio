# Keerthi BS — Portfolio

Static, responsive portfolio built with HTML/CSS/JS.

## Run locally
- Open `index.html` in any browser.

## Customize
- Update links in `index.html` for LinkedIn/GitHub.
- Put your PDF in `resume/Resume.pdf` to enable the download button.
- Edit content sections in `index.html` as needed.
- Tweak theme colors in `assets/css/styles.css` `:root` variables.

## Deploy
- GitHub Pages: push to a repo, enable Pages → Serve from root.
- Azure Static Web Apps: create app, point to repo, app artifact location is `/`. 

## Local dev server
- Requires Python 3 (already installed on your machine if `py` works)
- Start the server:
```powershell
py app.py
```
- Or choose a custom port:
```powershell
py app.py --port 5500
```
- If the browser doesn’t open automatically, visit `http://127.0.0.1:8000/index.html` (or your chosen port). 