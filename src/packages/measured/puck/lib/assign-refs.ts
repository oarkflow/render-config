export type Ref<ElementType = HTMLElement> =
  | React.RefObject<ElementType | null>
  | React.ForwardedRef<ElementType | null>
  | ((element: ElementType | null) => void);

export function assignRef<ElementType = HTMLElement>(
  ref: Ref<ElementType>,
  node: ElementType | null
) {
  if (typeof ref === "function") {
    ref(node);
    // todo: test this case
  } else if (
    ref &&
    typeof ref === "object" &&
    "current" in ref &&
    !Object.isFrozen(ref)
  ) {
    (ref as { current: ElementType | null }).current = node;
  }
}

export function assignRefs<ElementType = HTMLElement>(
  refs: Ref<ElementType>[],
  node: ElementType | null
) {
  refs.forEach((ref) => {
    assignRef<ElementType>(ref, node);
  });
}
