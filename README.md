# HART NEWS

## Purpose of this Project
This project, HART NEWS, was created as part of the ECS639U Web Programming module at Queen Mary University of London. The primary purpose of this group project is to develop an online newspaper web app similar to BBC News or the online portals for The Times and The Guardian. This app allows users to create an account, browse news articles categorized by topics, post comments, and customize their profiles with their favorite news categories.

### Mark achieved: 90%

## Technologies Used
- **Backend**: Django
- **Frontend**: Vue.js with Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Dependencies**:
  - Django
  - django-cors-headers
  - Vue.js
  - Bootstrap
  - Pinia
  - Vue Router
  - TypeScript


## How to Run the App 
## NOTE - THIS APP WILL NOT RUN UNLESS PERSONAL AWS CREDENTIALS ARE USED IN SETTINGS.PY

1. **Install backend dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
2. **DO NOT APPLY ANY MIGRATIONS AS THIS WILL DELETE THE DATA IN THE DATABASE**
3. **Start the backend server**:
    ```bash
    python manage.py runserver
    ```
4. **Open a new terminal** and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
5. **Install frontend dependencies**:
    ```bash
    npm i
    ```
6. **Start the frontend server**:
    ```bash
    npm run dev
    ```
7. **Open the app** in your browser at `http://localhost:8000`
## Demonstrations & Screenshots
Here are some screenshots of the final application and a demonstration:

### Homepage
![HART NEWS Homepage](https://github.com/rohailramesh/ECS639U-Web-Programming-2023-24-CW3/blob/main/Home%20Page.png)
![HART NEWS Sign-Up page](https://github.com/rohailramesh/ECS639U-Web-Programming-2023-24-CW3/blob/main/Sign-Up.png)
![HART NEWS Sign-In page](https://github.com/rohailramesh/ECS639U-Web-Programming-2023-24-CW3/blob/main/Sign-In.png)
![HART NEWS Profile page](https://github.com/rohailramesh/ECS639U-Web-Programming-2023-24-CW3/blob/main/Profile%20Page%201.png)
![HART NEWS Profile page](https://github.com/rohailramesh/ECS639U-Web-Programming-2023-24-CW3/blob/main/Profile%20Page%202.png)
![HART NEWS Favourites page](https://github.com/rohailramesh/ECS639U-Web-Programming-2023-24-CW3/blob/main/Favourites%20Page.png)
![HART NEWS Article page](https://github.com/rohailramesh/ECS639U-Web-Programming-2023-24-CW3/blob/main/Article%20Page%201.png)
![HART NEWS Article page](https://github.com/rohailramesh/ECS639U-Web-Programming-2023-24-CW3/blob/main/Article%20Page%201.png)
[![Project Demo](https://github.com/rohailramesh/ECS639U-Web-Programming-2023-24-CW3/blob/main/Home%20Page.png)](https://github.com/rohailramesh/ECS639U-Web-Programming-2023-24-CW3/blob/main/Project%20Demo.mov)


## Group Members and Contributions
- **Member 1**: Halimah Parvez Akhtar - Worked on the frontend and generated articles for application
- **Member 2**: Thurikka Jeevendra - Worked on the frontend and generated articles for application
- **Member 3**: Amber Khandwalla - Worked on the frontend and generated articles for application
- **Member 4**: Led team management efforts and contributed to the backend development and OpenShift deployment.



## Admin and Test Users
- **Admin Page**:
  - **URL**: [http://hartnews.example.com/admin](http://localhost:8000/admin)
  - **Username**: hartnews
  - **Password**: hart2023

- **Test Users**:
  - **User 1**: 
    - **Username**: nadeemTheGuardian
    - **Password**: queenMary2023
  - **User 2**: 
    - **Username**: michaelTheTimes
    - **Password**: queenMary2022
  - **User 3**: 
    - **Username**: pauloTheTelegraph
    - **Password**: queenMary2021
  - **User 4**: 
    - **Username**: zunairaTheIndependent
    - **Password**: queenMary2020
  - **User 5**: 
    - **Username**: hartTheDailyMail
    - **Password**: queenMary2019
