projeto=excel

local_frontend=/opt/clientes/99-excel/excel-frontend

server_frontend=/var/www/excel.davidmarques.com.br

angular_name=excel

ssh_alias=diamond

#
# Execução da build do frontend
#

echo ""
echo "Frontend - [1/2] Preparando o build"
echo ""

cd $local_frontend

if [ -f "./$local_frontend/dist" ]; then
  rm -rf "$local_frontend/dist"
fi

ng build --configuration production

echo ""
echo "Frontend - [2/2] Comprimindo arquivos do dist"
echo ""

if [ -f "./$projeto.tar" ]; then
    rm "./$projeto.tar"
    echo "Arquivo removido com sucesso."
fi

mv ./dist/$angular_name/browser/* ./dist
rm -rf ./dist/$angular_name
cd ./dist
tar acf ../$projeto.tar .
cd ..

#
# Execução no/para o servidor
#

echo ""
echo "Servidor - [1/2] Movendo arquivos para o servidor"
echo ""

scp $local_frontend/$projeto.tar $ssh_alias:/tmp

rm "$local_frontend/$projeto.tar"

rm -rf "$local_frontend/dist"

# Comando a serem executados dentro do ssh

echo ""
echo "Servidor - [2/2] Executando comandos no servidor"
echo ""

server_cmd=""

server_cmd=$server_cmd" cd $server_frontend;"
server_cmd=$server_cmd" rm -rf ./*;"
server_cmd=$server_cmd" mv /tmp/$projeto.tar .;"
server_cmd=$server_cmd" tar -xf ./$projeto.tar;"
server_cmd=$server_cmd" rm ./$projeto.tar;"

ssh $ssh_alias "$server_cmd"
