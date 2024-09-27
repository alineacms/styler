import {expect, test} from 'bun:test'
import styler from '../src'

test('styler', () => {
  const styles = styler('root')
  expect(styles()).toBe('root')
  expect(styles.with('a b')()).toBe('a b root')
  expect(styles(styler.global('a b'))).toBe('a b root')
  expect(styles(false && styler.global('a b'))).toBe('root')
  expect(styles.with(styles)()).toBe('root root')
  expect(styles(styles)).toBe('root root')
  expect(styles.mergeProps({className: 'x'})()).toBe('x root')
  expect(styles(styler.merge({className: 'x'}))).toBe('x root')
  expect(styles({a: true, x: '', y: 0, z: null})).toBe('is-a root')
  expect(styles({a: true, b: true})).toBe('is-a is-b root')
  expect(styles({a: true, b: true, c: false})).toBe('is-a is-b root')
  expect(styles({a: true}, {b: true})).toBe('is-a is-b root')
  expect(styles('a', 'b')).toBe('is-a is-b root')
  expect(styles('x')).toBe('is-x root')
  expect(styles.with('x')({a: true, b: true, c: false})).toBe(
    'is-a is-b x root'
  )
})

const module = {
  root: '__root',
  'root-sub': '__root-sub',
  'root-sub-sub': '__root-sub-sub',
  'is-a': '__is-a'
}

test('fromModule', () => {
  const styles = styler(module)
  expect(styles.root()).toBe('__root')
  expect(styles.root.sub()).toBe('__root-sub')
  expect(styles.root.sub.sub()).toBe('__root-sub-sub')
  expect(styles.root.sub.sub({a: true})).toBe('__is-a __root-sub-sub')
  expect(styles.root.sub.sub({b: true})).toBe('is-b __root-sub-sub')
})
