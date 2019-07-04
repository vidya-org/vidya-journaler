#!/bin/bash

function main()
{
  while true
  do
    find lib test -type f |
      entr -d bash entr_script.sh
  done
}

main "$@"
