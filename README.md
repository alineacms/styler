[![spring-easing's badge](https://deno.bundlejs.com/?q=@alinea/styler&badge=detailed&badge-style=for-the-badge)](https://bundlejs.com/?q=@alinea/styler)

# @alinea/styler

Class name composer. Fully typed in your IDE when paired with
[typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules).

```scss
// Some.module.scss
.root {
  color: blue;
  &-sub {
    color: red;
  }
}
.link {
  color: yellow;
  &.is-active {
    color: orange;
  }
  &.is-small {
    font-size: 2em;
  }
  &.is-large {
    font-size: 2em;
  }
}
```

```tsx
import styler from '@alinea/styler'
import css from './Some.module.scss'

const styles = styler(css)

<div className={styles.root()} />
// => <div class="root_zr2ux" /> (generated class name will vary)

// You can reach subclasses, separated in css by dashes, with dot access

<div className={styles.root.sub()} />
// => <div class="root-sub_zr2ux" />

// Reflect state by passing objects with boolean properties or strings

<a className={styles.link({active: true})} />
// => <a class="is-active_zr2ux link_zr2ux" />

<a className={styles.link('large')} />
// => <a class="is-large_zr2ux link_zr2ux" />

<a className={styles.link({active: false}, 'small')} />
// => <a class="is-small_zr2ux link_zr2ux" />

// Use `styler.global` to add a global classname

<div className={styles.root(styler.global('some-external-class'))} />
// => <div class="some-external-class root_zr2ux" />

// Use `styler.merge` to add in props with a className

<div className={styles.root(styler.merge({className: 'some-external-class'}))} />
// => <div class="some-external-class root_zr2ux" />
```
