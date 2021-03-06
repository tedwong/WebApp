import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from '../config/default';
import CommentView from './CommentView';
import {fetchCommentsBaseonMessageID} from '../MessageDB';
import {connect} from "react-redux";


class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {data:[]};
    this.setComment = this.setComment.bind(this);
  }

  componentDidMount() {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.fetchComments(user); 
      } else {
        this.setState({data:[]})
      }
    });
  }

  setComment(doc) {
    var val = doc.data();
//    var val = doc.data;
    this.state.data.push(val);
    this.setState({data:this.state.data});
  };

  
  fetchComments(user) {
    this.setState({user:user});
    if(this.props.messageUUID != null) {
        fetchCommentsBaseonMessageID(user, this.props.messageUUID, this.setComment)
    }    
  }

  render() {
    let elements = null;
    elements = this.state.data.reverse().map((comment) => {
        return (<CommentView comment={comment}/>);
      });      
    return (<div width="100%">{elements}</div>);
  }
};

export default CommentList;
