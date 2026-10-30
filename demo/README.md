# Demos

One page with a native `<details>` per framework. Each demo is a separate app loaded in an `<iframe>` on first expand, so frameworks are fully isolated and only load when opened.

```
index.html   landing page with the <details> sections
angular/     Angular 22: <app-icon> component and Angular Material mat-icon[icon] directive
react/       React 19 + Vite
vue/         Vue 3 + Vite
```

## Running

Requires `npm install` in the repository root first (for SVGO).

```sh
npm install
npm start
```

`npm start` builds everything into `dist/` and serves it:

```
dist/
  index.html          landing page
  icons/*.svg         one shared copy of the icons for all demos
  css/                tokens and slots for the HTML demo
  html/ angular/ react/ vue/
```

All demos use root-relative URLs (`/icons/…`, `/react/…`), so `dist/` must be served from the site root.

`npm run build` also type-checks every app: an unknown icon name fails the build.
