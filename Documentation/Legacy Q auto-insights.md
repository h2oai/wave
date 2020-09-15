# Auto-insights
Auto-Insight is an app that allows its users to get automatic insights from any dataset, thus enabling the user to make informed decisions effortlessly.

## Prerequisites
* Python 3.6+
* Q (you can download the latest version of [Q](https://github.com/h2oai/q/releases) and install it following the instructions on the [README.md](https://github.com/h2oai/q/blob/master/release.txt))

### Launching AutoInsights
* Launch Q and go to localhost:/8888 and sign in.
* Click on the ‘Table tab’ .
* Click on the ‘+” sign at the bottom right corner of the page and click “Upload table” to upload your datasets.
* On the next page, you have the option to customize the column by changing their types as you wish, but it needs to be accurate if you must get accurate insights. * Click ‘Continue’ then ‘import’.
You have the option to search your table, a kind of data exploration step, basically, this just describe your dataset, categorize the features into numerical and categorical data, the features types, the number of missing values, mean...etc.
* Once you are happy with your dataset, you can hit the ‘back’ arrow until you reach the Q app home page again, and go back on the ‘Table’ tab. Here you should be able to see the dataset you just imported.
* Click on the three vertical dots at the right hand of your table, Then click on “Q-insights”.

### Running insights:
When you click Q-insights, you will be ask to select the columns which you want to include:
##### *Step 1: Select columns*
You have the options here to select all, deselect all or just select a few then click “Next”.
##### *Step 2: Select the desired insights types and launch the app*
When the app is done running the insights, it will save the results in a notebook. So, on this page, you can start by changing the name of the notebook in the “Notebook title” if the name provided automatically is not ideal.
* The app will automatically propose a list of some insights. If you are okay with it, then click “analyze”.
* If you would like to modify the list of insights Click on “ Customize”.
* If you choose to customize, on the next page, the app with display all inbuilt insights, but only those applicable to your dataset and its features types will be available to select or deselect. For each insight selected, the setting are available at the bottom of the page.
* Click ‘Apply’ once you are done with the settings.
* Click ‘Analyze’
##### *Step 3: Obtaining the results*
Once the analysis is done go back on the Q home page:
* Go on the “Notebook” tab
* Click on your notebook to access your results.
* You can review them and make some notes by pressing the “+” sign at the botton/upper right of each graph. Everytime  you add a note, don't forget to save your note by pressing the save button the top right of the page.
