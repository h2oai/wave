// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { B, S } from 'h2o-wave'
import React, { PropsWithChildren, useEffect, useLayoutEffect, useRef } from 'react'

interface Props {
  forwardedRef: React.RefObject<HTMLDivElement>
  hasMore: B
  className: S
  style: React.CSSProperties
  isInfiniteLoading: B
  onInfiniteLoad: () => void
}

export default ({ forwardedRef, className, style, hasMore, children, isInfiniteLoading, onInfiniteLoad }: PropsWithChildren<Props>) => {
  const prevScrollHeight = useRef(0)
  const prevIsInfiniteLoading = useRef(isInfiniteLoading)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (forwardedRef.current?.scrollTop !== 0 || !hasMore) return
    prevScrollHeight.current = (e.target as HTMLDivElement).scrollHeight
    onInfiniteLoad()
  }

  useLayoutEffect(() => {
    const isNolongerLoading = prevIsInfiniteLoading.current && !isInfiniteLoading
    if (!forwardedRef.current || !isNolongerLoading) return
    forwardedRef.current.scrollTop = forwardedRef.current.scrollHeight - prevScrollHeight.current
  }, [children, forwardedRef, isInfiniteLoading])
  useEffect(() => {
    if (forwardedRef.current) forwardedRef.current.scrollTop = forwardedRef.current.scrollHeight
  }, [forwardedRef])
  useEffect(() => { prevIsInfiniteLoading.current = isInfiniteLoading }, [isInfiniteLoading])

  return (
    <div ref={forwardedRef} onScroll={handleScroll} className={className} style={style}>
      {hasMore && <Fluent.Spinner label='Loading...' />}
      {children}
    </div>
  )
}