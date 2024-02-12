# groceries-list

Project built using Typecscript, the MERN stack and Socket.io. Features fully implemented user register/login and authentication.

## Implemented user stories

- I as a user can create to-do items, such as a grocery list.
- I as another user can collaborate in real-time with user - so that we can (for example) edit our family shopping-list together.
- I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on things that are still pending.
- I as a user can filter the to-do list and view items that were marked as done - so that I can retrospect on my prior progress.
- I as a user can add sub-tasks to my to-do items - so that I could make logical groups of tasks and see their overall progress.
- I as a user can specify cost/price for a task or a subtask - so that I can track my expenses / project cost.
- INCOMPLETE - Prices and sums are correctly calculated on the backend and saved to the database but the frontend components are not rerendering correctly to reflect thos changes - I as a user can see the sum of the subtasks aggregated in the parent task so that in my shopping list I can see what contributes to the overall sum. For example I can have a task called “Salad”, where I'd add all ingredients as sub-tasks, and would see how much a salad costs on my shopping list.
- I as a user can make infinite nested levels of subtasks.

## Additional notes

- Beyond the aforementioned user stories it is also possible to add and delete lists and to add, edit and delete tasks / subtasks.
- To collaborate with another user in real-time, users have to be registered and logged in and then one must share the list using the share button when viewing a list and typing in the username of another user. After that, when both are viewing that same list, they can add, edit and delete tasks / subtasks and the all the users with whom that list was shared can immediately see the changes.
- Regarding deployment, while I tried to deploy the full app to Vercel, I ended up not being able to correctly deploy the backend due to using Socket.io to implement real-time collaboration with other users.
