# Berties Books

Modification of sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

to access search page, use /books/search.
to add books, use /books/bookadd.
/users/register form posts to /users/registered.
/books/list reads all books from DB and shows it in a list.
/books/bargainbooks queries DB for books priced below £20 and shows on the website in a dynamic list.

DotEnv:
Under normal circumstances you would include the .env in your gitignore so that it would be inaccessable, given my repository is public. 

I set up some variables in another file and called them within the createPool func, meaning that if I didn’t have the .env file, I wouldn’t be able to access the any of the data. Hence those with the .env are trusted users.

Audit:
To create a history of sign in attmepts, i created another database called login_attempts and put that into the create_db.sql.
then in the /loggedin logic i created a function that takes the username and success (bool) and deposits them into the new database.

/users/audit takes you to a page of all login attempts


Access control:
Addbook and bookadded both guarded to protect databbase integrity.

Search and view still permitted as new customers may want to browse before making an account

Audit also given a redirect. Only admins should have access to this page

Otherwise the site is viewable publically

input validation:
i have added input validation to the login, addbook as well as search books.