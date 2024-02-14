#!/bin/bash -eu

assert_true() {
    local actual="$1"
    local msg="${2-}"

    assert_eq true "$actual" "$msg"
    return "$?"
}

assert_eq() {
    local expected="$1"
    local actual="$2"
    local msg="${3-}"

    if [ "$expected" == "$actual" ]; then
        return 0
    else
        ([ "${#msg}" -gt 0 ] && log_failure "$expected == $actual :: $msg") || true
        return 1
    fi
}

log_failure() {
    printf "${RED}✖ %s${NORMAL}\n" "$@" >&2
}
