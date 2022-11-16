# Silzila - Data Exploration and Dashboarding App

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

![](silzila-frontend/src/assets/Silzila_logo.png)

Data exploration and dashboarding app

[**Installation**](#installation) | [**Demo**](#demo)

[Silzila](https://silzila.org/) is an open source tool (License information here) which enables you
to create meaningful visual charts in four easy steps

1. Connect to your Database
2. Define your Dataset
3. Visualize the data
4. Present charts in dashboard

# Installation

1. Make sure you have Python version 3.7 or higher.

2. Open command line or terminal and check your version of python by using the following code
   `python --version`

3. Verify that you also have setupTools by typing `pip list`

4. Install virtual environment if you don't have it already `pip install virtualenv`

5. Navigate into the folder of your choice where you want to install silzila project

6. Create a new virtual envronment `python -m venv <envName>`

7. Install silzila package `pip install silzila`

8. Activate the new virtual environment `.\<envName>\Scripts\activate`

9. Once the environment is active, you can then start the silzila app by typing the following
   command in prompt `silzila`. A new browser window will open up with an instance of silzila app

Note: When connecting to Database please check if Database service is up and running. For MS SQL
Server, please check if you have installed ODBC Driver and TCP/IP is enabled for the database.

# Demo

## 1. Connect with Database

Create connections to the databases which you need

![](silzila-frontend/src/assets/Silzila-New-Data-Connection-fast.gif)

## 2. Define your Dataset

Select a subset of tables from one of the Data Connections, define relation between tables and
create a dataset

![](silzila-frontend/src/assets/Silzila-NewDataset-2-fast.gif)

## 3. Visualize the data

Visualize the data in one of the many charts available

![](silzila-frontend/src/assets/Silzila-NewPlaybook-Tile-fast.gif)

## 4. Present charts in dashboard

Charts created in each of the tiles can be then displayed as required in the dashboard

![](silzila-frontend/src/assets/Silzila-Dashboard-fast.gif)
