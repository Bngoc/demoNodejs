#!/bin/bash

# set values for certificate DNs
# note: CN is set to different values in the sections below
ORG="000_Test_Certificates"

# set values that the commands will share
VALID_DAYS=360
CA_KEY=ca.pem
CA_CERT=ca.crt

CLIENT_KEY=client.pem
CLIENT_CERT=client.crt
CLIENT_CSR=client.csr
CLIENT_P12=client.p12

SERVER_KEY=server.key
SERVER_CERT=server.crt
SERVER_CSR=server.csr
KEY_BITS=2048

COUNTRY_NAME="VN"
DEFINE_L="Ha Noi"
DEFINE_ST="Ha Noi"
DEFINE_OU="Test 1"
DEFINE_EMAIL="ngoctbhy@gmail.com"

echo
echo "Create CA certificate..."
DEFINE_CN="Test CA"
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:$KEY_BITS -out $CA_KEY
echo openssl req -new -x509 -days $VALID_DAYS -key $CA_KEY -subj "C=$COUNTRY_NAME/ST=$DEFINE_ST/L=$DEFINE_L/O=$ORG/OU=$DEFINE_OU/CN=$DEFINE_CN/emailAddress=$DEFINE_EMAIL" -out $CA_CERT
echo "Done."

echo
echo "Creating Server certificate..."
DEFINE_CN="localhost"
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:$KEY_BITS -out $SERVER_KEY
echo openssl req -new -key "$SERVER_KEY" -subj "C=$COUNTRY_NAME/ST=$DEFINE_ST/L=$DEFINE_L/CN=$DEFINE_CN/O=$ORG/UID=$USER_ID" -out $SERVER_CSR
echo openssl x509 -days $VALID_DAYS -req -in $SERVER_CSR -CAcreateserial -CA $CA_CERT -CAkey $CA_KEY -out $SERVER_CERT
echo "Done."

echo
echo "Creating Client certificate..."
DEFINE_CN="certificate localhost"
USER_ID="buingoc"
P12_PASSWORD=123456
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:$KEY_BITS -out $CLIENT_KEY
echo openssl req -new -key $CLIENT_KEY -subj "/C=$COUNTRY_NAME/ST=$DEFINE_ST/L=$DEFINE_L/OU=$DEFINE_OU/O=$ORG/CN=$DEFINE_CN/emailAddress=$DEFINE_EMAIL/UID=$USER_ID" -out $CLIENT_CSR
echo openssl x509 -days $VALID_DAYS -req -in $CLIENT_CSR -CAcreateserial -CA $CA_CERT -CAkey $CA_KEY -out $CLIENT_CERT
echo openssl pkcs12 -in $CLIENT_CERT -inkey $CLIENT_KEY -export -password pass:$P12_PASSWORD -out $CLIENT_P12
echo "Done."

echo
echo "----- Don't forget to open your browser and install your $CA_CERT and $CLIENT_P12 certificates -----"
echo