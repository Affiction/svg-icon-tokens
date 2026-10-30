# SVG icons

Icons as CSS design tokens rendered with `mask`, based on [The best way to use icons in Web UIs](https://lea.verou.me/blog/2026/icons/) by Lea Verou ([@LeaVerou](https://github.com/LeaVerou)).

## Why

- **Icons are design tokens.** Every icon is a `--icon-<name>` custom property, so the icon set lives in one place and the design system controls which icons exist.
- **The icon is chosen in CSS, not in markup.** `.delete { --icon-start: var(--icon-trash) }` keeps HTML clean: no inline `<svg>`, no `<use>`, no extra wrapper elements.
- **One property to override.** Swapping an icon is just setting `--icon-start` again, so it works with `:hover`, states, dark mode, print, media and container queries.
- **Color comes from `color`.** The icon is painted with `currentColor`, so it matches the text and follows any color change automatically.
- **Only used icons are downloaded.** A token is just a URL until it is used in `mask`, so unused icons cost nothing, and no SVG ends up in the JS bundle.
- **Fewer problems than the alternatives.** Inline SVG is verbose and always ships its markup, `<use>` sprites are clunky, and icon fonts are heavy, fall back to wrong glyphs and break with screen readers and user font overrides.

Trade-offs: icons are single-color only (masks keep just the shape), parts of an icon can't be animated or styled separately, and the pseudo-element approach needs modern browsers (see below).

> [!WARNING]
> **Browser support.** Requires **Chrome/Edge 120, Safari 18, Firefox 151** or newer (~93% of users per Can I Use). Older browsers simply don't render the icons, so icon-only buttons must have an `aria-label`.
>
> | Feature | Chrome / Edge | Safari | Firefox |
> | --- | --- | --- | --- |
> | [Style queries](https://caniuse.com/css-container-queries-style) `@container style(--x)` | 111 | 18 | 151 (May 2026) |
> | [`@property`](https://caniuse.com/mdn-css_at-rules_property) | 85 | 16.4 | 128 |
> | [Unprefixed `mask`](https://caniuse.com/css-masks) | 120 | 15.4 | 53 |
>
> "Partial" style query support on Can I Use means [custom properties only](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_size_and_style_queries), which is all this approach needs.
>
> **Safari** has known WebKit bugs, and this demo **does not include workarounds yet**:
> - [#301609](https://bugs.webkit.org/show_bug.cgi?id=301609): icons don't show up until the user interacts with the element;
> - [#325900](https://bugs.webkit.org/show_bug.cgi?id=325900): `--icon-start: inherit` doesn't always work for non-inherited (`inherits: false`) registered properties.
>
> Workarounds are described in the [article](https://lea.verou.me/blog/2026/icons/).

## Structure

```
icons/raw/*.svg                 source icons (Figma exports etc.), single-color
icons/*.svg                     optimized by SVGO, generated, do not edit
css/icon-tokens.css             --icon-<name> tokens, generated, do not edit
css/icons.css                   --icon-start / --icon-end slots
types/icon-name.ts              IconName union type, generated, do not edit
scripts/                        build scripts, see below
index.html                      demo
```

## Scripts

| Command                  | What it does                                     |
| ------------------------ | ------------------------------------------------ |
| `npm run icons:optimize` | optimizes `icons/raw/` with SVGO into `icons/`   |
| `npm run icons:tokens`   | generates `css/icon-tokens.css` from `icons/*.svg` |
| `npm run icons:types`    | generates `types/icon-name.ts` (path can be overridden) |
| `npm run icons`          | runs all steps in order                          |

SVGO runs `preset-default`, `removeDimensions` and a small custom plugin that strips the frame-sized `clipPath` Figma adds to every export. `viewBox` and colors are kept: `fill="none"` and `stroke` define the shape the mask uses.

In Figma, apply "Outline stroke" before exporting.

## Running

```sh
npm install
npm start
```

The demo must be served over HTTP: masks don't load from `file://`.

Working demos for every framework below live in [`demo/`](demo/).

## Usage

```css
/* icon before the content */
.search {
  --icon-start: var(--icon-search);
}

/* icon after the content */
.next {
  --icon-end: var(--icon-arrow-right);
}

/* the icon takes its color from `color` */
.delete {
  color: crimson;
}
```

To add an icon, put the SVG into `icons/raw/` and run `npm run icons`.

## Frameworks

In framework components the component itself is the icon, so the mask goes on its own element: no style queries or `@property`, and the browser support warning above doesn't apply (`-webkit-mask` covers older Chrome and Safari).

<details>
<summary><h3>Angular</h3></summary>

Copy the optimized icons (without `raw/`) into the build, `angular.json`:

```json
"assets": [
  { "glob": "*.svg", "input": "../icons", "output": "icons" }
]
```

Generate the `IconName` type next to the component:

```sh
node ../scripts/build-icon-types.mjs src/app/icon/icon-name.ts
```

The component, `src/app/icon/icon.component.ts`:

```ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName } from './icon-name';

@Component({
  selector: 'app-icon',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[style.--icon]': 'url()',
  },
  styles: `
    :host {
      display: inline-block;
      flex: none;
      width: 1em;
      height: 1em;
      vertical-align: -0.125em;
      background-color: currentColor;
      -webkit-mask: var(--icon) no-repeat center / contain;
      mask: var(--icon) no-repeat center / contain;
      forced-color-adjust: none;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  protected readonly url = computed(() => `url(/icons/${this.name()}.svg)`);
}
```

Usage:

```html
<app-icon name="star" style="color: red" />

<button><app-icon name="search" /> Search</button>

<button aria-label="Delete"><app-icon name="trash" /></button>

<app-icon name="stra" /> <!-- compile error with strictTemplates -->
```

Size follows `font-size`, color follows `color`.

</details>

<details>
<summary><h3>Angular Material</h3></summary>

Material components (`mat-button`, `mat-icon-button`, `matIconPrefix`, `mat-menu-item`, …) style `mat-icon` specifically, so keep `mat-icon` and only change how it is painted: a directive adds the mask, Material keeps sizing, spacing and color.

Assets and the `IconName` type are set up the same way as in the Angular section above.

The directive, `src/app/icon/icon.directive.ts`:

```ts
import { computed, Directive, input } from '@angular/core';
import { IconName } from './icon-name';

@Directive({
  selector: 'mat-icon[icon]',
  host: {
    class: 'app-icon',
    '[style.--icon]': 'url()',
  },
})
export class IconDirective {
  readonly icon = input.required<IconName>();
  protected readonly url = computed(() => `url(/icons/${this.icon()}.svg)`);
}
```

Directives can't have their own styles, so the mask goes into the global `styles.css`:

```css
.mat-icon.app-icon {
  background-color: currentColor;
  -webkit-mask: var(--icon) no-repeat center / contain;
  mask: var(--icon) no-repeat center / contain;
  forced-color-adjust: none;
}
```

Usage:

```html
<button mat-icon-button aria-label="Delete">
  <mat-icon icon="trash" />
</button>

<button mat-flat-button>
  <mat-icon icon="star" />
  Add to favorites
</button>

<mat-form-field>
  <mat-icon matIconPrefix icon="search" />
  <input matInput />
</mat-form-field>

<mat-icon icon="stra" /> <!-- compile error with strictTemplates -->
```

Notes:

- `mat-icon` already sets `aria-hidden="true"`; put the accessible name on the button.
- A directive from another library on a bare `[icon]` selector would match `mat-icon` too.
- Multi-color icons can't be masks. For those, keep Material's own `svgIcon` with a URL resolver (needs `provideHttpClient()`); both can live side by side:

  ```ts
  provideAppInitializer(() => {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    registry.addSvgIconResolver((name) =>
      sanitizer.bypassSecurityTrustResourceUrl(`/icons/${name}.svg`),
    );
  }),
  ```

  ```html
  <mat-icon icon="star" />
  <mat-icon svgIcon="logo-color" />
  ```

</details>

### React and Vue setup

The examples assume a Vite project in a subfolder next to `icons/`. Copy the optimized icons into `public/` (served from the site root) and generate the `IconName` type:

```json
"scripts": {
  "icons": "mkdir -p public/icons && cp ../icons/*.svg public/icons/ && node ../scripts/build-icon-types.mjs src/icon/icon-name.ts"
}
```

<details>
<summary><h3>React</h3></summary>

Setup is shared with Vue, see [React and Vue setup](#react-and-vue-setup).

The component, `src/icon/Icon.tsx`:

```tsx
import type { CSSProperties } from 'react';
import type { IconName } from './icon-name';
import './Icon.css';

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const style = { '--icon': `url(/icons/${name}.svg)` } as CSSProperties;

  return (
    <span
      className={className ? `icon ${className}` : 'icon'}
      style={style}
      aria-hidden="true"
    />
  );
}
```

`src/icon/Icon.css`:

```css
.icon {
  display: inline-block;
  flex: none;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  background-color: currentColor;
  -webkit-mask: var(--icon) no-repeat center / contain;
  mask: var(--icon) no-repeat center / contain;
  forced-color-adjust: none;
}
```

Usage:

```tsx
<Icon name="star" className="red" />

<button><Icon name="search" /> Search</button>

<button aria-label="Delete"><Icon name="trash" /></button>

<Icon name="stra" /> {/* type error */}
```

</details>

<details>
<summary><h3>Vue</h3></summary>

Setup is shared with React, see [React and Vue setup](#react-and-vue-setup).

The component, `src/icon/Icon.vue`:

```vue
<script setup lang="ts">
import type { IconName } from './icon-name';

const { name } = defineProps<{ name: IconName }>();
</script>

<template>
  <span class="icon" :style="{ '--icon': `url(/icons/${name}.svg)` }" aria-hidden="true" />
</template>

<style scoped>
.icon {
  display: inline-block;
  flex: none;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  background-color: currentColor;
  -webkit-mask: var(--icon) no-repeat center / contain;
  mask: var(--icon) no-repeat center / contain;
  forced-color-adjust: none;
}
</style>
```

Usage (`class` and `style` fall through to the root `<span>`):

```vue
<Icon name="star" style="color: red" />

<button><Icon name="search" /> Search</button>

<button aria-label="Delete"><Icon name="trash" /></button>

<Icon name="stra" /> <!-- type error with vue-tsc -->
```

</details>
