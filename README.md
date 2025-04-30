You are on master branch. If you have a feature in development, use: git checkout [name_of_your_branch]. If you want to start a new feature, use: git flow start feature [name_of_your_feature]. It will create a branch /feature/[name_of_your_feature] from the develop branch. Please never merge on master instead if final project have a stable version

To make it work with backend API:

if you use the docker front on http://localhost:8080 :
- edit /requirements/back/srcs/app.js , uncomment line 25 and comment http://localhost:5173 line

if you use "npm run dev" in the front directory to use Vite :
- it should work by default.

If you want to access private views (need authentification) :
- Login seems buggy so don't use it , instead register and you will be logged.
- You can bypass by using return true in "isAuth" function.
