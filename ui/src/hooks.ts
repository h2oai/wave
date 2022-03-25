import { useEffect, useState } from "react"

export function useControlledComponent(props: any, val: any) {
  const [value, setValue] = useState(val)
  useEffect(() => setValue(val), [props, val])
  return [value, setValue]
}