import React from 'react';
import {getHeaders} from './utils';

class LikeButton extends React.Component {  

    constructor(props) {
        super(props);
        this.toggleLike = this.toggleLike.bind(this);
        this.like = this.like.bind(this);
        this.unlike = this.unlike.bind(this);
    }

    toggleLike(ev) {
        if (this.props.likeId) {
            console.log('unlike');
            this.unlike();
        } else {
            console.log('like');
            this.like();
        }
    }

    like() {
        // issue fetch request and then afterwards requery for the post:
        // this.props.requeryPost();
        const postId = this.props.postId;
        fetch('/api/posts/' + postId + '/likes', {
            headers: getHeaders(),
            body: JSON.stringify({}),
            method: "POST"
        }).then(response => response.json())
        .then(data => {
            this.props.requeryPost();
        })
    }

    unlike() {
        // issue fetch request and then afterwards requery for the post:
        // this.props.requeryPost();
        const postId = this.props.postId;
        const likeId = this.props.likeId;
        fetch('/api/posts/' + postId + '/likes/' + likeId, {
            headers: getHeaders(),
            body: JSON.stringify({}),
            method: "DELETE"
        }).then(response => response.json())
        .then(data => {
            this.props.requeryPost();
        })
    }

    render () {
        const likeId = this.props.likeId;
        return (
            <button role="switch"
                className="like" 
                aria-label="Like Button" 
                aria-checked={likeId ? true : false}
                onClick={this.toggleLike}>
                <i className={likeId ? 'fas fa-heart' : 'far fa-heart'}></i>                        
            </button>
        ) 
    }
}

export default LikeButton;