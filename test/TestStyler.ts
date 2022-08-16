import {test} from 'uvu'
import * as assert from 'uvu/assert'
import {fromModule, styler} from '../src'

test('styler', () => {
  const styles = styler('root')
  assert.is(styles(), 'root')
  assert.is(styles.with('a b')(), 'a b root')
  assert.is(styles.mergeProps({className: 'x'})(), 'x root')
  assert.is(styles({a: true}), 'is-a root')
  assert.is(styles({a: true, b: true}), 'is-a is-b root')
  assert.is(styles({a: true, b: true, c: false}), 'is-a is-b root')
  assert.is(styles({a: true}, {b: true}), 'is-a is-b root')
  assert.is(styles('a', 'b'), 'is-a is-b root')
  assert.is(styles('x'), 'is-x root')
  assert.is(styles.with('x')({a: true, b: true, c: false}), 'is-a is-b x root')
})

const module = {
  root: '__root',
  'root-sub': '__root-sub',
  'root-sub-sub': '__root-sub-sub',
  'is-a': '__is-a'
}

test('fromModule', () => {
  const styles = fromModule(module)
  assert.is(styles.root(), '__root')
  assert.is(styles.root.sub(), '__root-sub')
  assert.is(styles.root.sub.sub(), '__root-sub-sub')
  assert.is(styles.root.sub.sub({a: true}), '__is-a __root-sub-sub')
  assert.is(styles.root.sub.sub({b: true}), 'is-b __root-sub-sub')
})

test.run()
