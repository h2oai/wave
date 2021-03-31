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

package wave

import (
	"errors"
	"strconv"
	"strings"
	"unicode"
)

const (
	BYTE = 1 << (10 * iota)
	KILOBYTE
	MEGABYTE
	GIGABYTE
	TERABYTE
	PETABYTE
	EXABYTE
)

var invalidByteSizeError = errors.New("invalid byte size")

// parseBytes parses string representations (e.g. 42K or 42KB or 42KiB) to bytes
func parseBytes(s string) (uint64, error) {
	s = strings.ToUpper(strings.TrimSpace(s))
	i := strings.IndexFunc(s, unicode.IsLetter)

	if i == -1 {
		return 0, invalidByteSizeError
	}

	num, unit := s[:i], s[i:]
	b, err := strconv.ParseFloat(num, 64)
	if err != nil || b < 0 {
		return 0, invalidByteSizeError
	}

	switch unit {
	case "E", "EB", "EIB":
		return uint64(b * EXABYTE), nil
	case "P", "PB", "PIB":
		return uint64(b * PETABYTE), nil
	case "T", "TB", "TIB":
		return uint64(b * TERABYTE), nil
	case "G", "GB", "GIB":
		return uint64(b * GIGABYTE), nil
	case "M", "MB", "MIB":
		return uint64(b * MEGABYTE), nil
	case "K", "KB", "KIB":
		return uint64(b * KILOBYTE), nil
	case "B":
		return uint64(b), nil
	default:
		return 0, invalidByteSizeError
	}
}
