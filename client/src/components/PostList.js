import React from 'react';
import Post from './Post'

class PostList extends React.Component {

  render() {
    let _this = this;
    return (
      <div>
       
        {this.props.posts ?
          <ul className="list-group-item p-4">
            {this.props.posts.map(function (postItem) {
              return (
             <li className="list-group-item mt-5" key={postItem._id}>
                  <Post refreshTimeline={_this.props.refreshTimeline} post={postItem}
                          user={_this.props.user}/>
                  
                  
                </li>
                
              )
            })}
          </ul>
          :
          <p>Loading posts, please wait...</p>
        }
      </div>
    )
  }
}

export default PostList;