# Silzila - Data Visualization Tool

![](silzila-frontend/src/assets/silzila_crop.png)

Data exploration and dashboarding app

[**Installation**](#installation) | [**Demo**](#demo)

[Silzila](https://silzila.org/) is an open source tool (License information here) which enables you
to create meaningful visual charts in four easy steps

1. Connect to your Database
2. Define your Dataset
3. Visualize the data
4. Present charts in dashboard

DataConnections and Datasets can be viewed in the home page

![DataHome](silzila-frontend/src/assets/dataHome-ss.png)

Visit [Silzila](https://silzila.org/) website to learn more

## Installation

Make sure you have Python version XX or higher.

Open command line or terminal and check your version of python by using the following code
`python --version`

Verify that you also have setupTools by typing `pip list`

Install virtual environment if you don't have it already `pip install virtualenv`

Navigate into the folder of your choice where you want to install silzila project

Create a new virtual envronment `python -m venv <envName>`

Install silzila package `pip install silzila`

Activate the new virtual environment `.\<envName>\Scripts\activate`

Once the environment is active, you can then start the silzila app by typing the following command
in prompt `silzila`

## Demo

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
