const hasClassName = Symbol.for('@alinea/styler/hasClassName')
type VariantImpl<VariantNames extends string> =
  | VariantNames
  | {[Key in VariantNames]?: any}
  | {[hasClassName]: string}
  | Styler
  | false
  | undefined
  | null
export type Variant<VariantNames extends string = string> =
  | VariantImpl<VariantNames>
  | Array<VariantImpl<VariantNames>>

export interface Styler<VariantNames extends string = string> {
  (...variants: Array<Variant<VariantNames>>): string
  /** @deprecated use styler.global */
  with(...extra: Array<string | Styler | undefined>): Styler
  /** @deprecated use styler.merge */
  mergeProps(attrs: Record<string, any> | undefined): Styler
  toString(): string
}

export type GenericStyles = Styler & {[key: string]: GenericStyles}

type Style<State> = string extends State
  ? GenericStyles
  : State extends string
  ? State extends `${infer Parent}-${infer Sub}`
    ? {[P in Parent]: Style<Sub>}
    : {[P in State]: Styler}
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export type ModuleStyles<M = object> = object extends M
  ? GenericStyles
  : UnionToIntersection<Style<keyof M>>

const VARIANT_PREFIX = 'is-'

export function styler<Module extends Record<string, string>>(
  styles: Module
): ModuleStyles<Module>
export function styler<VariantNames extends string = string>(
  className?: string,
  globals?: Array<string>,
  module?: Record<string, string>
): Styler<VariantNames>
export function styler(
  input: string | Record<string, string>,
  globals = [],
  module: Record<string, string> = typeof input === 'object' ? input : undefined
): Styler | ModuleStyles {
  const className = typeof input === 'string' ? input : ''
  const result = module?.[className] ?? className
  return new Proxy(
    Object.assign(
      function instance(...variants: Array<any>) {
        return variants
          .flatMap(function makeVariant(variant) {
            if (!variant) return []
            if (Array.isArray(variant)) return variant.map(makeVariant)
            if (typeof variant === 'function') return variant[hasClassName]
            if (typeof variant === 'object') {
              if (hasClassName in variant) return variant[hasClassName]
              return Object.entries(variant)
                .map(([cl, active]) => active && cl)
                .filter(Boolean)
                .map(makeVariant)
            }
            const requestedVariant = VARIANT_PREFIX + variant
            return module?.[requestedVariant] ?? requestedVariant
          })
          .concat(globals)
          .concat(result)
          .join(' ')
      },
      {
        [hasClassName]: result,
        toString() {
          return result
        },
        with(...extra) {
          return styler(
            className,
            globals.concat(extra.filter(Boolean)),
            module
          )
        },
        mergeProps(props) {
          if (!props) return this
          return this.with(props.className)
        }
      }
    ),
    {
      get(target, property) {
        if (typeof property !== 'string') return target[property]
        return (target[property] ??= styler(
          className ? `${className}-${property}` : property,
          undefined,
          module
        ))
      }
    }
  )
}

styler.global = (className: string) => {
  return {[hasClassName]: className}
}

styler.merge = (props: {className?: string}) => {
  return styler.global(props.className)
}

/** @deprecated use the styler function */
export const fromModule = <Module extends Record<string, string>>(
  styles: Module
) => styler(styles)

export default styler
