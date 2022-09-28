# Module 2 Group Assignment

CSCI 5117, Spring 2022, [assignment description](https://canvas.umn.edu/courses/291031/pages/project-2)

## App Info:

* Team Name: Full-Stack-Overflow
* App Name: Habitual.ly
* App Link: https://project-two-8bf54.web.app

### Students

* Rayan Dhamuke, dhamu002@umn.edu
* Hung DoVu, dovu0001@umn.edu
* Sami Hammami, hamma212@umn.edu
* Michael McCune, mccun050@umn.edu
* Dongwei Pan, pan00179@umn.edu


## Key Features

**Describe the most challenging features you implemented
(one sentence per bullet, maximum 4 bullets):**

* The logic for updating a streak. There are so many cases to account when paired with the features we made available.
* The logic for the stats page.


Which (if any) device integration(s) does your app support?

* Camera

Which (if any) progressive web app feature(s) does your app support?

* Add to home screen



## Mockup images

[Link to Our Mock Up](https://balsamiq.cloud/sf0pego/pbcgni6)


## Testing Notes

**Is there anything special we need to know in order to effectively test your app? (optional):**

* These 2 features -- updating streak by touching and holding, and the drag and drop on Organize Habit -- work on mobile, but cause the pop-up when you hold on an image on a mobile device to show. An update streak button, is placed below the habit on smaller screen sizes, allowing for easier updating of habit streaks.



## Screenshots of Site (complete)

<img width="1680" alt="homeView" src="https://user-images.githubusercontent.com/54782164/166331061-01969bac-729e-4eb0-8710-07d7cad6116d.png">

#### Home Page
The home page displays all habits for a user with options to sort them. Users can add habits and categories from the home page. This is the primary page where users can click and hold on habits to update the daily progress. Once the daily progress is complete, the streak will be updated on the Habit Page.


<img width="1680" alt="categoryPage" src="https://user-images.githubusercontent.com/54782164/166331610-eba427c5-ef3f-4141-81e9-2f9e930d37b2.png">

#### Category Page
The category page displays all habits for a user within a category and has options to sort them like the home page. Users can add habits directly to a category form this page. This page also has functionality to update the daily progress of habits like the home page.


<img width="1680" alt="oneHabitStats" src="https://user-images.githubusercontent.com/54782164/166331631-92275bee-4970-4b9f-9cad-5c5673997772.png">

#### Habit Page
The habit page shows stats about a particular habit. At the top it shows the best check-in streak, number of day completions, and percentage to complete (if goal days is set). Right above the graphs it shows the timeframe remaining for the habit (if goal days is set). It shows a streak graph, a time density graph for the most frequent check-in times, and a bar graph showing the most common days of the week the habit is completed. Also from the page a habit can be edited, or in the case the habit check-in streak has reached its goal days users can choose how to continue with their habit.


<img width="1680" alt="userStats" src="https://user-images.githubusercontent.com/54782164/166331687-6d177e37-740b-4709-8f8d-8d91af15ac34.png">

#### User Stats Page
The user stats page is similar to the habit page stats just applied to all habits. The first line graph differs by showing how many total habits were completed for the day in the past week. The other graphs are simply applied to all habits.


<img width="1680" alt="organizeHabits" src="https://user-images.githubusercontent.com/54782164/166331720-3d7cefb2-13e4-44ca-878f-e759972df0f1.png">

#### Organize Habits Page
The organize habits page allows users to quickly move habits to different categories by dragging and dropping. Users can also quickly delete habits by dragging them to the trash can at the bottom of the screen


<img width="1680" alt="sideMenu" src="https://user-images.githubusercontent.com/54782164/166331743-9a58d1bb-4176-47f4-9732-eeb3dc5d6408.png">

#### Side Menu
The side menu allows users to sign in/out and navigate between main pages (Home, Stats (user), Organize Habits, categories). The categories in the sidebar have the color of the category.



## Splash Page

![image](https://user-images.githubusercontent.com/90271702/166315631-b7f18797-0a09-4640-9529-70f47d049d2c.png)



## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries (e.g., Vue, Vuefire, Firebase).**

* Bulma: CSS Framework used for majority of styling
* Bootstrap: Used for side menu styling
* Chart.js: Used for graphs on the habit page and user stats page

**If there's anything else you would like to disclose about how your project
relied on external code, expertise, or anything else, please disclose that
here:**

...
