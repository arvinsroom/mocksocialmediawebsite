This project is build using Sequilize, Nodejs server and React JS front end.

## These steps include
### Running a version of this project for development only. This one is strictly while developing code
### Running a version of this project for development only. This one can be used to host this project locally
### Running a version of this project for production. With all the optimizations...

## Run React JS frontend (only for development purposes)
This is for local development as it uses webpack server and also serve the static content using node, and any change you make to the any frontend file it should automatically build and start (module.hot reloading) the server.
Step 1: Go to frontend folder and from terminal run ```npm run install```
Step 2: Run ```npm run start-dev```
Step 3: You should be able to go to [http://localhost:8080](http://localhost:8080) to view it in the browser. 

However you won't be able to make any request to the backend as it not set up yet!

To have your backend up and running, perform the following steps:
Step 1: Make sure Mysql instance is running in your local machine. Download preferebly 8.0.22 version and install it for your local machine from
        https://downloads.mysql.com/archives/community/ for your machine.
Step 2: Make sure Mysql instance is up and running on your local machine.

Please check config-development.json to know which configuration you would need to run your
database successfully.
You can set ```name```, ```username```, and ```password``` to whatever you like, backend sever script will automatically build the database and the required user with given password.

Once you have everything set up, you can perform follwing tasks:
Step 1: Go to backend folder
Step 2: Run ``` npm install ```
Step 3: Run ``` npm run build-dev && npm run run-dev-server ```. This should build the bundle and should display a message that the server is running in post 8081.

Make sure to perform these steps, correctly.
You can use the following steps to make sure if the database exist.
Run ``` mysql -u <username> -p <password>``` (here username and password are the one you provided before, make sure you have installed mysql client on your pc)

Go to [http://localhost:8080](http://localhost:8080) and Thats it! You should have your local development server up and running.

## Using Docker, This version uses NGNIX with docker (For development or locally hosting the site)

Step 1: First uncomment the line ```origin: http://${IP_ADDRESS}:8080``` from backend/server.js

Follow the steps from instruction above to have MYSQL instance up and running:
Step 1: Make sure Mysql instance is running in your local machine. Download preferebly 8.0.22 version and install it for your local machine from
        https://downloads.mysql.com/archives/community/ for your machine.
Step 2: Make sure Mysql instance is up and running on your local machine.

Please check config-development.json to know which configuration you would need to run your
database successfully.
You can set ```name```, ```username```, and ```password``` to whatever you like, backend sever script will automatically build the database and the required user with given password.

Make sure to perform these steps, correctly.
You can use the following steps to make sure if the database exist.
Run ``` mysql -u <username> -p <password>``` (here username and password are the one you provided before, make sure you have installed mysql client on your pc)


Step 3: Download docker on your Computer from https://docs.docker.com/docker-for-mac/install/.
Step 4: Also download docker-compose from https://docs.docker.com/compose/install/.
Step 5: From root directory run ```docker-compose -f docker-compose.dev.yml up -d --no-deps --build```

This should have everything set up and running.


# Run and host this project on your AWS etc.
This is an example of hosting it on AWS.

1) Get AWS account
2) Get a Amazon RDS MySQL instance (8.0.22)
3) Get Amazon EC2 instance
4) Configue EC2 instance with database info you created in step 2
5) run docker-compose up from root of this repo.
6) copy this image to Amazon EC2 instance.


## Configure certbot for https

Perform these steps in Amazon Linux 2 (From: https://aws.amazon.com/blogs/compute/extending-amazon-linux-2-with-epel-and-lets-encrypt/ )
``` cd /tmp ```
``` wget -O epel.rpm –nv https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm ```
``` sudo yum install -y ./epel.rpm ```

``` sudo yum install -y certbot ``` (python3-certbot-nginx)

Once certbot is installed

1) we need to setup the volume from docker container to talk to the ec2 instance:
   Ad this to docker-compose.yml frontend file:
volumes:
- /home/ec2-user/certs-data/:/data/letsencrypt/

1) Assuming ec2-user is the user you created when setting up the Amazon AMI Linux 2
   Change the ngnix.conf file to:
```
server {
  listen 80 default_server;
  # listen 443 ssl default_server;
  server_name studysocial.media www.studysocial.media;

  location ^~ /.well-known {
    allow all;
    root  /data/letsencrypt/;
  }
  # host static front-end files
  location / {
    root /usr/share/nginx/html/dist;
    try_files $uri /index.html;
  }

  # node api reverse proxy
  location /api/ {
    # forward any request which has /api/ to a proxied server with following address
    proxy_pass http://studysocial.media:8081;

    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

3) Run the command ```docker-compose up -d --no-deps --build```

4) before generating the certificates make sure to create the certs-data and folder in user directory
```cd /home/ec2-user```
```mkdir certs-data```
```cd certs-data```
```mkdir .well-known```
```cd .well-known```
6) Once it is successful run ``` sudo certbot certonly --webroot -w /home/ec2-user/certs-data/ -d studysocial.media -d www.studysocial.media ```

7) After finished, change the step 1 volume to mount on the same location as docker
volumes:
- /etc/letsencrypt/:/etc/letsencrypt/

8) Now we can add the ssl certificates in NGINX config
   This is how your ngnix file should look like before publishing...
```
server {
  listen 80;
  server_name studysocial.media www.studysocial.media;
  location ^~ /.well-known {
    allow all;
    root  /data/letsencrypt/;
  }
  location / {
    # redirect any traffic on http to https
    return 301 https://$host$request_uri;
  }
}

server {
  listen 443 ssl default_server;
  server_name studysocial.media www.studysocial.media;
  ssl_certificate /etc/letsencrypt/live/studysocial.media/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/studysocial.media/privkey.pem;

  # host static front-end files
  location / {
    root /usr/share/nginx/html/dist;
    try_files $uri /index.html;
  }

  # node api reverse proxy
  location /api/ {
    # forward any request which has /api/ to a proxied server with following address
    proxy_pass http://studysocial.media:8081;

    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

```

Connecting to MYSQLfrom EC2 instance:

Step 1: ```mysql -h mockwebsitedb.ch8pmurklo7i.ca-central-1.rds.amazonaws.com -P 3306 -u mockwebsiteAdmin -p```
Step 2: Then enter the password


From MySQL 8.X server or client the largest possible packet that can be trasmitted at once is 1GB. We however allow no more than 20MB.

Changes made to the local MySQL instance.
1) Go to cmd line and login to your mysql instance ``` mysql -h localhost -u root -p ```
2) If you see an error similar to ``` command not found: mysql ``` try running ```export PATH=${PATH}:/usr/local/mysql/bin/```
3) Then enter your password
4) run ``` SET GLOBAL max_allowed_packet=20000000;```


Changes made to the AWS MYSQL RDS instance.
