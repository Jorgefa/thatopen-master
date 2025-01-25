C3.4 - DONE
- Export import functionality

C3.10
- Project details. Convert elements to react components
    - New projecr form as react component - DONE
    - Edit btn working. - DONE
    - Plus todo btn
    - Todo cards
    - Todo search bar
    - Warning messages (projects not found) - DONE

C3.11
- Improve warning "thre is no projects to display" when the searching box doesnt gound anyhting

C4.3
- Complete try catch on loading projects to update the projects if there is already one with that name

C4.5
- UpdateProject method


FROM LESSON

Create the ToDo components
As the title implies, you will have to create the corresponding components for the ToDo functionality in the application. The goal is to:



Define a main component to hold the list of ToDo cards in the Project Details Page. You can name the component as you like, but something as ProjectTasksList would be a good name.

Create the ToDo card component. You can use the same UI done in previous modules as a starting point, but update it to display the status and priority. Also, make sure to give different colors to each priority and status.

Inside the ProjectTasksList, integrate the general SearchBox component we did during the lessons implemented in such a way that can filter the list of ToDo Cards.

Create a Todo Form Component and make it work so it can create ToDos and update the ProjectTasksList. This form not only serves the purpose of creating new ToDos, but also to update them.



Store ToDos in Firebase
Make sure to store the ToDos created in Firestore. Obviously, the goal is not only to store them, but also to retrieve them when the project enters a project.