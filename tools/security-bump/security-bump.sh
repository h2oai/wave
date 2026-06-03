#!/usr/bin/env bash
#
# Scan the waved binary for Go stdlib CVEs, bump Go to the lowest patch on the
# current minor branch that fixes all of them, run e2e, and open a PR.
#
# Env knobs:
#   OS, ARCH        — build target (default linux/amd64)
#   SKIP_E2E=1      — skip e2e (local dev convenience; not for CI)
#   SKIP_PR=1       — make changes locally, but don't push or open a PR
#   BASE_BRANCH     — PR base (default: main)
#
# Exit codes:
#   0  — success, or no fixable CVEs (no-op)
#   1  — unrecoverable error
#   2  — missing dependency
#   3  — CVE requires jumping Go minor branch (manual review needed)

set -euo pipefail

OS="${OS:-linux}"
ARCH="${ARCH:-amd64}"
BASE_BRANCH="${BASE_BRANCH:-main}"

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

log() { printf '[security-bump %s] %s\n' "$(date +%H:%M:%S)" "$*" >&2; }
die() { log "ERROR: $*"; exit 1; }

for tool in go trivy jq gh git; do
  command -v "$tool" >/dev/null 2>&1 || { log "missing tool: $tool"; exit 2; }
done

CURRENT_GO="$(awk '/^go [0-9]/{print $2; exit}' go.mod)"
[[ -n "$CURRENT_GO" ]] || die "could not read go version from go.mod"
CURRENT_GO_BRANCH="$(echo "$CURRENT_GO" | awk -F. '{print $1"."$2}')"
log "current go in go.mod: $CURRENT_GO (branch $CURRENT_GO_BRANCH)"

LATEST_TAG="$(git tag --list 'v[0-9]*.[0-9]*.[0-9]*' --sort=-v:refname | head -1 || true)"
[[ -n "$LATEST_TAG" ]] || die "no v<semver> tags found"
CURRENT_VERSION="${LATEST_TAG#v}"
IFS='.' read -r MAJ MIN PATCH <<<"$CURRENT_VERSION"
NEXT_VERSION="$MAJ.$MIN.$((PATCH+1))"
log "latest release: $CURRENT_VERSION → next patch: $NEXT_VERSION"

BUILD_DIR="build/security-bump"
BIN_PATH="$BUILD_DIR/waved"
mkdir -p "$BUILD_DIR"
log "building $OS/$ARCH binary at $BIN_PATH"
GOOS="$OS" GOARCH="$ARCH" GOEXPERIMENT=boringcrypto go build \
  -ldflags "-X main.Version=$NEXT_VERSION -X main.BuildDate=$(date +%Y%m%d%H%M%S)" \
  -o "$BIN_PATH" ./cmd/wave/main.go

SCAN_JSON="$BUILD_DIR/trivy.json"
log "scanning binary with trivy"
trivy rootfs --scanners vuln --detection-priority comprehensive "$BIN_PATH"
trivy rootfs --scanners vuln --detection-priority comprehensive \
  --format json --output "$SCAN_JSON" --quiet "$BIN_PATH"

STDLIB_COUNT="$(jq '[.Results[]?.Vulnerabilities[]? | select(.PkgName=="stdlib")] | length' "$SCAN_JSON")"
log "stdlib vulnerabilities found: $STDLIB_COUNT"
if [[ "$STDLIB_COUNT" == "0" ]]; then
  log "no stdlib CVEs — nothing to do"
  exit 0
fi

ORPHAN_CVES="$(jq -r --arg branch "$CURRENT_GO_BRANCH" '
  [ .Results[]?.Vulnerabilities[]?
    | select(.PkgName == "stdlib")
    | select(([(.FixedVersion // "") | split(", ")[] | select(startswith($branch + "."))] | length) == 0)
    | .VulnerabilityID
  ] | join(", ")
' "$SCAN_JSON")"

if [[ -n "$ORPHAN_CVES" ]]; then
  log "CVE(s) with no fix on go $CURRENT_GO_BRANCH branch: $ORPHAN_CVES"
  log "manual review required — script will not auto-bump across Go minor branches"
  exit 3
fi

FIX_VERSION="$(jq -r --arg branch "$CURRENT_GO_BRANCH" '
  [ .Results[]?.Vulnerabilities[]?
    | select(.PkgName == "stdlib")
    | (.FixedVersion // "") | split(", ")[]
    | select(startswith($branch + "."))
  ]
  | unique
  | sort_by(split(".") | map(tonumber))
  | last // ""
' "$SCAN_JSON")"

[[ -n "$FIX_VERSION" ]] || die "could not determine fix version (unexpected)"

cmp_versions() {
  printf '%s\n%s\n' "$1" "$2" | sort -V -C
}
if cmp_versions "$FIX_VERSION" "$CURRENT_GO" && [[ "$FIX_VERSION" != "$CURRENT_GO" ]]; then
  log "fix version $FIX_VERSION is older than current $CURRENT_GO — nothing to do"
  exit 0
fi
if [[ "$FIX_VERSION" == "$CURRENT_GO" ]]; then
  log "go.mod already at $CURRENT_GO, no bump needed (stale DB?)"
  exit 0
fi

log "lowest version fixing all stdlib CVEs on $CURRENT_GO_BRANCH branch: $FIX_VERSION"

BRANCH="chore/security-bump/go-$FIX_VERSION"

if [[ "${SKIP_PR:-0}" != "1" ]]; then
  if gh pr list --head "$BRANCH" --state open --json number --jq 'length' | grep -q '^[1-9]'; then
    log "open PR already exists for $BRANCH — skipping"
    exit 0
  fi
  if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
    log "remote branch $BRANCH already exists — skipping (delete it to retry)"
    exit 0
  fi
fi

log "running: make update-go GO_VERSION=$FIX_VERSION"
make update-go GO_VERSION="$FIX_VERSION"

if [[ "${SKIP_E2E:-0}" != "1" ]]; then
  make setup-ui
  make build-ui
  make setup-e2e
  sudo ./e2e/venv/bin/playwright install-deps
  cd e2e && ./venv/bin/pytest -x --browser chromium
else
  log "SKIP_E2E=1 — skipping e2e"
fi

if [[ "${SKIP_PR:-0}" == "1" ]]; then
  log "SKIP_PR=1 — leaving changes uncommitted. Diff:"
  git --no-pager diff --stat
  exit 0
fi

git checkout -b "$BRANCH"
git add .
git -c user.name="${GIT_USER_NAME:-wave-bot}" \
    -c user.email="${GIT_USER_EMAIL:-wave-bot@h2o.ai}" \
    commit -m "security: Bump Go to $FIX_VERSION to clean up CVEs."
git push -u origin "$BRANCH"

CVE_LIST="$(jq -r '
  [.Results[]?.Vulnerabilities[]? | select(.PkgName=="stdlib")]
  | sort_by(.Severity) | reverse
  | .[]
  | "- **\(.VulnerabilityID)** (\(.Severity)) — fixed in \(.FixedVersion // "n/a")  \n  \(.Title // "")"
' "$SCAN_JSON")"

PR_BODY=$(cat <<EOF
Automated security bump from \`make security-bump\`.

**Go:** \`$CURRENT_GO\` → \`$FIX_VERSION\`
**Target release after merge:** \`$NEXT_VERSION\`

## Trivy findings (stdlib)

$CVE_LIST

e2e: $([[ "${SKIP_E2E:-0}" == "1" ]] && echo "skipped" || echo "passed")
EOF
)

gh label create auto-release \
  --description "Dispatch Release Wave when this PR is merged" \
  --color BFD4F2 2>/dev/null || true

gh pr create \
  --base "$BASE_BRANCH" \
  --head "$BRANCH" \
  --title "security: Bump Go to $FIX_VERSION" \
  --label auto-release \
  --body "$PR_BODY"

log "done"
