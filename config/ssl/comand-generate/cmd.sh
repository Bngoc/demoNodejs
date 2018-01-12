1. CA
	cmd:	openssl req -new -x509 -days 360 -key ca.key
	cmd:	openssl req -new -x509 -days 360 -key ca.key -out ca.crt													[instal-web]	
	
2. Server
	cmd:	openssl genrsa -out server.key 2048								(Free - ssl-self)							[apache, nginx, node] 	[Free - Buy]
	cmd:	echo openssl req -new -key server.key -out server.csr			(Free - ssl-self)													[Free - Buy]														[Free - Buy]
	cmd:	openssl x509 -days 360 -req -in server.csr -CAcreateserial -CA ca.crt -CAkey ca.key -out server.crt			[apache, nginx, node]
	
3. Client
	cmd:	openssl genrsa -out client.key 2048
	cmd:	openssl req -new -key client.key -out client.csr
	cmd:	openssl x509 -days 360 -req -in client.csr -CAcreateserial -CA ca.crt -CAkey ca.key -out client.crt
	cmd: 	openssl pkcs12 -in client.crt -inkey client.key -export -password pass:123456 -out client.p12   			[install-web]
	
	
NOTE:	
	-x509 ...(*).. CN: domain || ip 

OPT:
	file: generate.sh

CHECK
	openssl s_client -connect local.nodejs.vn:1230 -state -debug
	openssl s_client -connect myweb.com:443 -showcerts

LINK
	https://httpd.apache.org/docs/2.4/ssl/ssl_faq.html

	

