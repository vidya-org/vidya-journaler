#!/bin/bash

function main()
{
  set_calling_dir_global
  set_project_dir_global "$@"

  while true
  do
    find "$PROJECT_DIR/lib" "$PROJECT_DIR/test" -type f |
      entr -d bash "$PROJECT_DIR/entr_script.sh" "$PROJECT_DIR"
  done
}

function set_project_dir_global()
{
  local relative_path

  relative_path=$(dirname "$0")

  local absolute_path

  absolute_path=$(cd "$relative_path" && pwd)

  create_global_readonly "PROJECT_DIR" "$absolute_path"
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
