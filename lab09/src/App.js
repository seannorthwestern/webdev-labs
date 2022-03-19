import React from 'react';
import NavBar from './NavBar.js';
import Profile from './Profile.js';
import Suggestions from './Suggestions.js';
import Stories from './Stories.js';
import Posts from './Posts.js';

class App extends React.Component {  

    render () {
        return (
            <div>

            <NavBar title = "Photo App" username = "webdev" />

            <aside>
                <Profile />
                <Suggestions />
            </aside>

            <main className="content">
                <Stories />
                <Posts />
            </main>

            </div>
        );
    }
}

export default App;