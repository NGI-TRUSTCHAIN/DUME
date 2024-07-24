#!/bin/bash

read -p 'Migration name: ' name

npx prisma migrate dev --name "$name"
