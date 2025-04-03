/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Returns attributes and values of a node in a convenient way.
 *
 * @example
 * // Given the following JSX element:
 * // <ExampleElement attr1="15" attr2 />
 * //
 * // The attributes would be represented as:
 * // {
 * //   attr1: {
 * //     hasValue: true,
 * //     value: '15' // Note: attribute values are typically strings
 * //   },
 * //   attr2: {
 * //     hasValue: false,
 * //     value: undefined
 * //   }
 * // }
 * //
 * // The `hasValue` property distinguishes between attributes with explicit
 * // values (even empty ones like `attr=""`) and boolean attributes (flags)
 * // without assigned values. This distinction can be important for ESLint rules.
 */
export default class NodeAttributes {
  attributes: Record<
    string,
    | {
        hasValue: true;
        value: any;
      }
    | {
        hasValue?: false;
      }
  >;

  constructor(ASTnode: any) {
    this.attributes = {};
    ASTnode.attributes.forEach((attribute: any) => {
      if (!attribute.type || attribute.type !== "JSXAttribute") {
        return;
      }

      if (attribute.value) {
        // hasValue
        const value =
          typeof attribute.value.value === "string" ? attribute.value.value
          : typeof attribute.value.expression?.value !== "undefined" ?
            attribute.value.expression.value
          : attribute.value.expression?.properties;

        this.attributes[attribute.name.name] = {
          hasValue: true,
          value,
        };
      } else {
        this.attributes[attribute.name.name] = {
          hasValue: false,
        };
      }
    });
  }

  has(attrName: string): boolean {
    return Boolean(this.attributes[attrName]);
  }

  hasAny(): boolean {
    return Boolean(Object.keys(this.attributes).length);
  }

  hasValue(attrName: string): boolean {
    return Boolean(this.attributes[attrName]?.hasValue);
  }

  value(attrName: string): any {
    const attr = this.attributes[attrName];

    if (!attr) {
      return true;
    }

    if ("hasValue" in attr && attr.hasValue) {
      return attr.value;
    }

    return undefined;
  }
}
