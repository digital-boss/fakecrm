import fs from 'node:fs';

export class Dal {
  
  constructor() {
    this.load();
  }
  
  // Private 
  
  newPostId () {
    const ids = this.data.map(i => i.id).sort((a,b)=>a-b);
    return ids[ids.length-1]+1;
  }

  newPostCommentId (postId) {
    const post = this.getPost(postId);
    const ids = (post.comments || []).map(i => i.id).sort((a,b)=>a-b);
    return ids.length === 0 ? 1 : ids[ids.length-1]+1;
  }

  // Common

  load () {
    const content = fs.readFileSync('data/data.json');
    this.data = JSON.parse(content);
  }

  persist () {
    fs.writeFileSync('data/data.json', JSON.stringify(this.data, undefined, 2), 'utf-8');
  }

  // Posts

  createPost(obj) {
    obj.id = obj.id || this.newPostId()
    this.data.push(obj);
    return obj.id;
  }
  
  updatePost(id, obj) {
    const o = this.getPost(id);
    Object.assign(o, obj);
  }
  
  getPosts() {
    return this.data;
  }
  
  getPost(id) {
    const o = this.data.find(i => i.id == id);
    if (!o) {
      throw new Error('Not found');
    }
    return o;
  }
  
  deletePost(id) {
    const idx = this.data.findIndex(i => i.id == id);
    if (idx === -1) {
      throw new Error('Not found');
    }
    return this.data.splice(idx, 1);
  }

  // Comments

  createComment(postId, obj) {
    obj.id = obj.id || this.newPostCommentId(postId)
    const post = this.getPost(postId);
    post.comments = post.comments || [];
    post.comments.push(obj);
    return obj.id;
  }
  
  updateComment(postId, id, obj) {
    const o = this.getPostComment(postId, id);
    Object.assign(o, obj);
  }
  
  getPostComments(postId) {
    const post = this.getPost(postId);
    return post.comments || [];
  }
  
  getPostComment(postId, id) {
    const post = this.getPost(postId);
    const o = (post.comments || []).find(i => i.id == id);
    if (!o) {
      throw new Error('Not found');
    }
    return o;
  }
  
  deleteComment(postId, id) {
    const post = this.getPost(postId);
    const idx = (post.comments || []).findIndex(i => i.id == id);
    if (idx === -1) {
      throw new Error('Not found');
    }
    const result = post.comments.splice(idx, 1);
    return result;
  }
}
