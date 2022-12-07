import React from 'react'

const useUpdateOnlyEffect = (func: (...args: any) => any, deps: any[]) => {
    const didMount = React.useRef(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => { didMount.current ? func() : didMount.current = true }, deps)
}

export default useUpdateOnlyEffect