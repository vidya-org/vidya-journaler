#!/bin/bash

function main()
{
  set_calling_dir_global
  while true
  do
    find lib test -type f |
      entr -d bash entr_script.sh
  done
}

function set_calling_dir_global()
{
  local current_folder
  current_folder=$(pwd)

  create_global_readonly "CALLING_DIR" "$current_folder"
}

function create_global_readonly()
{
  declare -gr "$1=$2"
}

main "$@"
