# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To run available scripts, please ensure that latest stable [Node version](https://nodejs.org/en) installed.

## Setup

If project is newly cloned, please run:

### `npm install`

This installs all the dependencies needed for the application to run locally.

## Running Local Project

Once setup is finished, you can run:

### `npm start`

This runs the app in the development mode.\
Please open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Visiting Deployed Page

You can also access this application via [Github pages](https://jimvital.github.io/ota-file-manager).

## Functionalities

Before interacting with the application, the user must provide a _.zip_ file by clicking the `Browse` button. User will be prompted with an error message if an invalid file is selected.

Once the _.zip_ file is loaded, a list will appear with all of its contents.

The user should now be able to **rename** and **create copies** of each file.

For rename action, if a duplicate value is detected, an error message will appear accordingly and the user will be prevented from applying the action.

These actions have a timeout in order to simulate **pause** and **resume**. These interactions appear once the user applies the corresponding action.

If the user is done with the updates, the new contents can be zipped and saved by clicking the `Save to directory` button.
