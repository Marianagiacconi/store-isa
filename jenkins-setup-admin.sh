#!/bin/bash

echo "=== Configurando Jenkins para crear usuario administrador ==="

# Detener Jenkins
echo "Deteniendo Jenkins..."
sudo systemctl stop jenkins

# Crear configuración temporal sin seguridad
echo "Creando configuración temporal sin seguridad..."
sudo tee /var/lib/jenkins/config.xml > /dev/null << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<hudson>
  <disabledAdministrativeMonitors/>
  <version>2.462.2</version>
  <numExecutors>2</numExecutors>
  <mode>NORMAL</mode>
  <useSecurity>false</useSecurity>
  <projectNamingStrategy class="jenkins.model.ProjectNamingStrategy$DefaultProjectNamingStrategy"/>
  <workspaceDir>${JENKINS_HOME}/workspace/${ITEM_FULL_NAME}</workspaceDir>
  <buildsDir>${ITEM_ROOTDIR}/builds</buildsDir>
  <markupFormatter class="hudson.markup.EscapedMarkupFormatter"/>
  <jdks/>
  <viewsTabBar class="hudson.views.DefaultViewsTabBar"/>
  <myViewsTabBar class="hudson.views.DefaultMyViewsTabBar"/>
  <clouds/>
  <scmCheckoutRetryCount>0</scmCheckoutRetryCount>
  <views>
    <hudson.model.AllView>
      <owner class="hudson" reference="../../.."/>
      <name>all</name>
      <filterExecutors>false</filterExecutors>
      <filterQueue>false</filterQueue>
      <properties class="hudson.model.View$PropertyList"/>
    </hudson.model.AllView>
  </views>
  <primaryView>all</primaryView>
  <slaveAgentPort>-1</slaveAgentPort>
  <label></label>
  <nodeProperties/>
  <globalNodeProperties/>
</hudson>
EOF

# Iniciar Jenkins
echo "Iniciando Jenkins..."
sudo systemctl start jenkins

echo ""
echo "=== INSTRUCCIONES ==="
echo "1. Ve a http://localhost:8080"
echo "2. Ahora podrás acceder sin contraseña"
echo "3. Ve a 'Manage Jenkins' > 'Configure System'"
echo "4. En 'Security' habilita 'Enable security'"
echo "5. Selecciona 'Jenkins' own user database'"
echo "6. Marca 'Allow users to sign up'"
echo "7. Guarda la configuración"
echo "8. Ve a 'Sign up' y crea tu usuario administrador"
echo "9. Una vez creado, desmarca 'Allow users to sign up'"
echo ""
echo "Presiona Enter cuando hayas terminado..."
read

# Restaurar configuración original
echo "Restaurando configuración original..."
sudo systemctl stop jenkins
sudo cp /var/lib/jenkins/config.xml.backup /var/lib/jenkins/config.xml
sudo systemctl start jenkins

echo "¡Configuración completada!"
echo "Ahora puedes acceder con tu usuario administrador en http://localhost:8080" 