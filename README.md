## Spending Tracker v.2

Glitch - https://a3-estherkim.onrender.com

**Summary**
I used Express, MongoDB, and Bootstrap, along with Javascript and HTML, in this application to create a spending tracker. This is version 2 of the first spending tracker where the data is now kept in a separate database through MongoDB and the Express framework was utilized to help simplify the development of the web server. The user can create an account and log in to start adding items to their spending list. The user can edit and delete items they have added. Additionally, the data is persistent, so even after they log out and closer the website, their data will remain. The data of each user is marked so that only the current user's data will be displayed. Users can create an account by registering a username and password, and they can also login using a GitHub account. I chose these strategies because they seemed to be the most straightforward to implement.

Some challenges I faced in creating this application was figuring out how to refactor the code to add in Express and MongoDB. This was my first time using this framework and database, so learning the syntax was a learning curve. Additionally, to add the edit functionality, it took trial and error to figure out how to render the page different depending on which item was chosen. I wanted to display the values already stored in the database so that the user could see what they were changing, but it was challenging to figure out how to change and show the values of the input tags dynamically.

For the CSS Framework, I decided to use Bootstrap because I have some experience with it, it seemed to be versatile, and I like the way it looks. For the body of the html, I customized the CSS to use a font and background color of my choice. For the navigation bar, I customized the CSS for the text color, background color, and hover of the link elements.

Express Middleware Utilized:
- express.static(): sends static assets from the specified folder.
- express.json(): parses the JSON data that is sent with requests.
- session(): used for storing session data on server to manage user sessions.
- passport.initialize(): initializes passport for authentication.
- passport.session(): is used with express-session to allow users to stay logged in across requests.
- There is one middleware that is used to check that the server has properly connected to the database. It first checks that the three global variables that connects to the three different collections is not null. If they aren't null, then the process moves onto the next function. If at least one of them is null, then a status 503 is sent as a response to indicate something went wrong.
<!---![image info](images/image.png)--->

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy. I first linked my application to GitHub to obtain a client ID and client secret, as well as specify the homepage url and the authorization callback url. I added a local strategy constructor that authenticates the request to sign in through GitHub. I also added routes for the GitHub authentication, adding in the user to the database if they are signing in through GitHub for the first time. If it is not their first time, then only the session information is updated. This was challenging because I have never implemented OAuth authentication before, so this was all new to me. Since I haven't done this before, it was hard to decipher the error messages and to figure out what was going wrong, requiring a lot of patience and trial and error. Also, I initially used cookie-session, but I ended up switching to express-session because it seemed that passport was dependent on express-session.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative. 
  - Provide informative, unique page titles - I changed the page titles to have unique, informative titles. I put the purpose of each page in the title with the website name afterwards.
  - Provide clear instructions - I added clear instructions for adding items into the spending list, specifying what should and should not be entered into the input field.
  - Ensure that interactive elements are easy to identify - I styled the navigation bar elements so that the color changes when the links are hovered over, active, or keyboard focused.
  - Provide sufficient contrast between foreground and background - I chose a light background with darker text colors. Anywhere where there is a dark background, I flipped it to have a lighter text color. For the navigation bar, I made sure that the hover, active, and keyboard focus colors would be darker than the original color because the text of the elements is a really light color.
  - Associate a label with every form control - Every input has a label for all the forms. All the inputs for the forms have a label right above the box for the user input.

