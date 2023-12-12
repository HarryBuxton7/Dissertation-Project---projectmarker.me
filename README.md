# Project Marker 

This repo contains UI and API code for "Project Marker", a web app which enables university lecturers to double-blind mark dissertation and thesis projects.

The deployed app can be found at [projectmarker.me](https://projectmarker.me/)

Website is deployed using CI/CD using Netlify for the client server and Render for the API server.

## How to run locally


create a .env file

    MONGO_URI=Mongo DB Url here
    PASSWORD=Password here
    SECRET=Secret here

MongoDB should allow your IP address to connect else it won't work

    cd client
    npm install all
    npm run dev

    cd server
    npm install all
    npm run dev

Once this is all done it should work on your local machine


## Development

Push to main branch and the site is automatically deployed to Netlify and Render
