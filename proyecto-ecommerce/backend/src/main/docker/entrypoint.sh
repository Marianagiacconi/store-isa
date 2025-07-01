#!/bin/bash

echo "La aplicación comenzará en ${JHIPSTER_SLEEP}s..." && sleep ${JHIPSTER_SLEEP}
exec java ${JAVA_OPTS} -jar "app.jar" "$@" 