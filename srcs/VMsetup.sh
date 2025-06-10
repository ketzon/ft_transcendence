#!/bin/bash

set -e

WHITE='\033[0m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'

ORIGIN_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [[ ! $(command -v vagrant) ]]; then
    echo -e "${RED}ERROR: Vagrant not installed. Exiting...${WHITE}"
    exit
fi

if [[ -z "${VAGRANT_HOME}" ]]; then
    echo -e "${YELLOW}WARNING: VAGRANT_HOME undefined, defaulting to \$HOME/goinfre${WHITE}"
    export VAGRANT_HOME="$HOME/goinfre"
fi

cd $VAGRANT_HOME

echo -e "${GREEN}Creating VM...${WHITE}"
if [[ -f ./Vagrantfile ]]; then
    echo -e "${BLUE}INFO: Vagrantfile already exists, skipping creation${WHITE}"
else
    vagrant init alvistack/ubuntu-24.10
    if [[ ! -f ./Vagrantfile ]]; then
        echo -e "${RED}ERROR: Failed to create Vagrantfile. Exiting...${WHITE}"
        exit
    fi
fi

echo -e "\n${BLUE}INFO: Booting up VM${WHITE}"
vagrant up

echo -e "\n${BLUE}INFO: Installing packages, you may be asked to enter your password a few times. default password is 'vagrant'${WHITE}"
scp -rp -P 2222 $ORIGIN_DIR/requirements $ORIGIN_DIR/docker-compose.yml $ORIGIN_DIR/install_packages.sh vagrant@127.0.0.1:~
ssh vagrant@127.0.0.1 -p 2222 sudo bash install_packages.sh

echo -e "\n${GREEN}INFO: setup completed!${WHITE}"
