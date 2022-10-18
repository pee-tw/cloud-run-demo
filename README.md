# From code to deployment with minimal access control ASAP
This repos contains a minimal setup that shows how to deploy frontend and backend with a shared secret access control inside a container. In the hopes that someone may benefit from this in the future :smiley:

## The architecture
We have a frontend that's built and serve in Nginx container, the frontend has some logic that need some temporary perisitent. So, we use `json-server` on the backend to have basic CRUD. Then, we deploy these two containers on GCP's Cloud Run.

## Frontend's access control
The simplest way I can think of without having to actually use Firebase Authentication or AWS Cognito is to just use .htpasswd

Nginx.conf has been setup to only serve pages when the request has the right username and password.

### Generating .htpasswd
Generating .htpasswd is as easy as running a simple command `htpasswd -c .htpasswd {username}` in this demo, I've already created a user called `demo` by running 

`htpasswd -c .htpasswd demo`  

And punched in a password phrase of `demo-demo` twice when prompted to do so.

## Backend's access control
`json-server` seems to be using ExpressJS behind the scene so we can use middleware to validate whether the HTTP requests has the our custom shared secret header `x-api-key` in this demo.

## Deploying to GCP Cloud Run
To deploy to GCP Cloud Run, we need a service account from GCP's IAM that has the right permissions.

First, create a GCP project to get the `PROJECT_ID`. It is advisable to export this to the terminal, so that we can run the rests of the command without substituting PROJECT_ID too many times.

`export PROJECT_ID=my-project-1234`

Then, check if you already have Google Cloud SDK by running 

`gcloud --version`

If you don't have it installed, you can easily grab it with `brew install --cask google-cloud-sdk`

Then, login from CLI with `gcloud auth login`

Now, we tell the CLI which project we want to interact with
`gcloud config set project $PROJECT_ID`

Enable the required services with

`gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com`

Now, we create a service account

```
gcloud iam service-accounts create github-ci \
  --description="Cloud Run deploy account" \
  --display-name="Cloud-Run-Deploy"
```
And grant the permissions with
```
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:github-ci@$PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/run.admin

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:github-ci@$PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/storage.admin

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:github-ci@$PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/iam.serviceAccountUser
```
Now, export the keys and upload this to GitHub Action's secret
```
gcloud iam service-accounts keys create key.json \
    --iam-account github-ci@$PROJECT_ID.iam.gserviceaccount.com
```
After the first deployment, check what are the urls generated from the deployment and update the environments in the build process.

That's it folks!