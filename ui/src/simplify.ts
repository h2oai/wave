// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
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

// 
// Simplify.js, ported to TypeScript, with minor refactoring.
// Original implementation: mourner.github.io/simplify-js
// BSD 2-Clause "Simplified" License
//

/*
Copyright (c) 2017, Vladimir Agafonkin
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
 (c) 2017, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

import { B, F, U } from './core'

export class P {
  constructor(readonly x: F, readonly y: F) { }
}

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
function getSqDist(p1: P, p2: P) {
  const
    dx = p1.x - p2.x,
    dy = p1.y - p2.y
  return dx * dx + dy * dy
}

// square distance from a point to a segment
function getSqSegDist(p: P, p1: P, p2: P) {
  let
    x = p1.x,
    y = p1.y,
    dx = p2.x - x,
    dy = p2.y - y

  if (dx !== 0 || dy !== 0) {
    const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy)

    if (t > 1) {
      x = p2.x
      y = p2.y
    } else if (t > 0) {
      x += dx * t
      y += dy * t
    }
  }

  dx = p.x - x
  dy = p.y - y

  return dx * dx + dy * dy
}
// rest of the code doesn't care about point format

// basic distance-based simplification
const P0: P = { x: 0, y: 0 }
function simplifyRadialDist(points: P[], sqTolerance: F) {
  let
    prevPoint = points[0],
    point: P = P0

  const
    newPoints = [prevPoint]

  for (let i = 1, len = points.length; i < len; i++) {
    point = points[i]
    if (getSqDist(point, prevPoint) > sqTolerance) {
      newPoints.push(point)
      prevPoint = point
    }
  }

  if (prevPoint !== point) newPoints.push(point)

  return newPoints
}

function simplifyDPStep(points: P[], first: U, last: U, sqTolerance: F, simplified: P[]) {
  let
    maxSqDist = sqTolerance,
    index: U = 0

  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last])
    if (sqDist > maxSqDist) {
      index = i
      maxSqDist = sqDist
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified)
    simplified.push(points[index])
    if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified)
  }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(points: P[], sqTolerance: F) {
  const
    last = points.length - 1,
    simplified = [points[0]]
  simplifyDPStep(points, 0, last, sqTolerance, simplified)
  simplified.push(points[last])
  return simplified
}

// both algorithms combined for awesome performance
export function simplify(points: P[], tolerance: F, highestQuality: B) {
  if (points.length <= 2) return points
  const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1
  points = highestQuality ? points : simplifyRadialDist(points, sqTolerance)
  points = simplifyDouglasPeucker(points, sqTolerance)
  return points
}
