# Maybe

`Maybe` is essentially a union type. Internally, a `Maybe` is represented as a `Just` holding a value or a `Nothing`, holding no value.

Operations on a `Maybe`, such as `map` will work on the value contained in a `Just`, but will be bypassed when the `Maybe` contains a `Nothing`, providing safe operations by encapsulating behavior that removes the need for repeated checks for `null`, `undefined` or any other invalid value for some operation.
