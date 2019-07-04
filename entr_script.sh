#!/bin/bash

function main()
{
  tput reset

  print_header "Running tests..."
  npm test

  echo

  print_header 'Running GIT Status...'
  git status

  print_timestamp
}

function print_timestamp()
{
  echo
  date
}

function print_line()
{
  printf "%0.s$1" $(seq 1 "$2")
  echo
}

function print_header()
{
  print_line '=' 50
  echo -e "$1"
  print_line '-' 50
}

main "$@"
