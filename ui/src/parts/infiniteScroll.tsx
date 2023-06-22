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

import { B, S, U } from 'h2o-wave'
import React from 'react'

interface Props {
  forwardedRef: React.RefObject<HTMLDivElement>
  hasMore: B
  className: S
  style: React.CSSProperties
  onInfiniteLoad: () => void
  children: JSX.Element[]
  loadingComponent: JSX.Element
  isInfiniteLoading: B
}

// React functional components do not supprt getting snapshots BEFORE updates to measure proper scroll position.
// So we need to use a class component here.
// https://github.com/facebook/react/issues/15221.
// Credit: https://github.com/tonix-tuft/react-really-simple-infinite-scroll.
export default class InfiniteScrollList extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    if (this.props.forwardedRef.current) this.props.forwardedRef.current.scrollTop = this.props.forwardedRef.current.scrollHeight
  }

  getSnapshotBeforeUpdate(prevProps: Props) {
    const isNolongerLoading = prevProps.isInfiniteLoading && !this.props.isInfiniteLoading
    const hasMoreChildren = this.props.children.length > prevProps.children.length
    if (isNolongerLoading && hasMoreChildren) return this.props.forwardedRef.current?.scrollHeight
  }

  componentDidUpdate(_prevProps: Props, _prevState: unknown, scrollDelta?: U) {
    if (!scrollDelta || !this.props.forwardedRef.current) return
    this.props.forwardedRef.current.scrollTop = this.props.forwardedRef.current.scrollHeight - scrollDelta
  }

  handleScroll() {
    if (this.props.forwardedRef.current?.scrollTop === 0 && this.props.hasMore) {
      this.props.onInfiniteLoad()
    }
  }

  render() {
    const { forwardedRef, className, style, hasMore, children, loadingComponent, isInfiniteLoading } = this.props
    return (
      <div ref={forwardedRef} onScroll={this.handleScroll} className={className} style={{ overflow: 'auto', ...style }}>
        {hasMore && isInfiniteLoading && loadingComponent}
        {children}
      </div>
    )
  }
}