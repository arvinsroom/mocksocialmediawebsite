This project is build using Sequilize, Nodejs server and React JS front end.

# Run this project locally

## Run React JS frontend
Step 1: Go to frontend folder and from terminal run ```npm run install```
Step 2: Run ```npm run prod-server && npm run run-prod-server```
Step 3: You should be able to go to [http://localhost:3000](http://localhost:3000) to view it in the browser.

But wait, you haven't set anything for the backend. Before you can actually make all requests, you would have to follow some of the following steps:

Before running the backend nodejs server, you have to make sure Mysql instance is running in your local machine.
https://downloads.mysql.com/archives/community/

And choose preferebly 8.0.22 version and install it for your local machine.
Once it is up and running in your local environment you can set up.

Please check config-development.json to know which configuration you would need to run your
database successfull.

## Run Node JS server with all database migrations
Step 1: Go to backend folder and from terminal run ```npm run install```
Step 2: Run ```npm run prod-server && npm run run-prod-server``` from within backend folder.

Now you should be able to successfully run this application on your local machine.

# Run and host this project on your AWS etc.
This is an example of hosting it on AWS.

1) Get AWS account
2) Get a Amazon RDS MySQL instance (8.0.22)
3) Get Amazon EC2 instance
4) Configue EC2 instance with database info you created in step 2
5) run docker-compose up from root of this repo.
6) copy this image to Amazon EC2 instance.
