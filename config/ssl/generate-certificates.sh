#!/bin/bash

# set values for certificate DNs
# note: CN is set to different values in the sections below
ORG="000_Test_Certificates"

# set values that the commands will share
VALID_DAYS=360
CA_KEY=ca.key
CA_CERT=ca.crt
CLIENT_KEY=client.key
CLIENT_CERT=client.crt
CLIENT_CSR=client.csr
CLIENT_P12=client.p12
SERVER_KEY=server.key
SERVER_CERT=server.crt
SERVER_CSR=server.csr
KEY_BITS=2048

FILE_CA_KEY=C:/Users/Bui/Desktop/Nodejs/Demo/config/ssl/$CA_KEY
FILE_CA_CERT=C:/Users/Bui/Desktop/Nodejs/Demo/config/ssl/$CA_CERT

FILE_SERVER_KEY=C:/Users/Bui/Desktop/Nodejs/Demo/config/ssl/$SERVER_KEY
FILE_SERVER_CSR=C:/Users/Bui/Desktop/Nodejs/Demo/config/ssl/$SERVER_CSR

FILE_CLIENT_KEY=C:/Users/Bui/Desktop/Nodejs/Demo/config/ssl/$CLIENT_KEY
FILE_CLIENT_CSR=C:/Users/Bui/Desktop/Nodejs/Demo/config/ssl/$CLIENT_CSR
FILE_CLIENT_CERT=C:/Users/Bui/Desktop/Nodejs/Demo/config/ssl/$CLIENT_CERT

echo $FILE_SERVER_KEY
echo $FILE_SERVER_CSR


echo
echo "Create CA certificate..."
CN="Test CA"
#openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:$KEY_BITS -out $CA_KEY
#echo openssl req -new -x509 -days $VALID_DAYS -key "$FILE_CA_KEY" -subj "/CN=$CN/O=$ORG" -out $CA_CERT
echo "Done."

echo
echo "Creating Server certificate..."
CN="localhost"
#openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:$KEY_BITS -out $SERVER_KEY
#echo openssl req -new -key "$FILE_SERVER_KEY" -subj "/CN=$CN/O=$ORG" -out $SERVER_CSR
#echo openssl x509 -days $VALID_DAYS -req -in $FILE_SERVER_CSR -CAcreateserial -CA $FILE_CA_CERT -CAkey $FILE_CA_KEY -out $SERVER_CERT
echo "Done."

echo
echo "Creating Client certificate..."
CN="Test User 1"
USER_ID="buingoc"
P12_PASSWORD=
#openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:$KEY_BITS -out $CLIENT_KEY
#echo openssl req -new -key $FILE_CLIENT_KEY -subj "/CN=$CN/O=$ORG/UID=$USER_ID" -out $CLIENT_CSR
#echo openssl x509 -days $VALID_DAYS -req -in $FILE_CLIENT_CSR -CAcreateserial -CA $FILE_CA_CERT -CAkey $FILE_CA_KEY -out $CLIENT_CERT
#echo openssl pkcs12 -in $FILE_CLIENT_CERT -inkey $FILE_CLIENT_KEY -export -password pass:$P12_PASSWORD -out $CLIENT_P12
echo "Done."

echo
echo "----- Don't forget to open your browser and install your $CA_CERT and $CLIENT_P12 certificates -----"
echo