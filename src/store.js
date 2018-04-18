import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);
const getAuthHeader = () => {
   return { headers: {'Authorization': localStorage.getItem('token')}};
}


export default new Vuex.Store({
  state: {
    author: {},
    token: '',
    viewingStories: true,
    loginError: '',
    registerError: '',
    feed: [],
    updates: [],
  },
  getters: {
   author: state => state.author,
   getToken: state => state.token,
   loggedIn: state => {
     if (state.token === '')
        return false;
      return true;
   },
   viewingStories: state => state.viewingStories,
   loginError: state => state.loginError,
   registerError: state => state.registerError,
   feed: state => state.feed,
   updates: state => state.updates,
  },
  mutations: {
    setAuthor (state, author) {
      state.author = author;
    },
    setToken (state, token) {
      state.token = token;
      if (token === '')
	      localStorage.removeItem('token');
      else
	      localStorage.setItem('token', token);
    },
    setViewingStories (state, status) {
      state.viewingStories = status;
    },
    setLoginError (state, message) {
      state.loginError = message;
    },
    setRegisterError (state, message) {
      state.registerError = message;
    },
    setFeed (state, feed) {
      state.feed = feed;
    },
    setUpdates (state, updates) {
      state.updates = updates;
    }
  },
  actions: {
    initialize(context) {
      let token = localStorage.getItem('token');
      if(token && token !== '') {
       // see if we can use the token to get my user account
       axios.get("/api/me",getAuthHeader()).then(response => {
         context.commit('setToken',token);
         context.commit('setAuthor',response.data.author);
       }).catch(err => {
         // remove token and user from state
         localStorage.removeItem('token');
         context.commit('setAuthor',{});
         context.commit('setToken','');
       });
      }
    },
    register(context,author) {
       axios.post("/api/authors",author).then(response => {
       context.commit('setAuthor', response.data.author);
       context.commit('setToken',response.data.token);
       context.commit('setRegisterError',"");
       context.commit('setLoginError',"");
     }).catch(error => {
       context.commit('setLoginError',"");
       context.commit('setAuthor',{});
       context.commit('setToken','');
       if (error.response) {
         if (error.response.status === 403)
           context.commit('setRegisterError',"That username is already taken.");
           return;
       }
       context.commit('setRegisterError',"Sorry, your request failed. We will look into it.");
     });
   },
   login(context,author) {
      axios.post("/api/login",author).then(response => {
      	context.commit('setAuthor', response.data.author);
      	context.commit('setToken',response.data.token);
      	context.commit('setRegisterError',"");
      	context.commit('setLoginError',"");
      }).catch(error => {
	      context.commit('setRegisterError',"");
        context.commit('setAuthor',{});
        context.commit('setToken','');
      	if (error.response) {
      	  if (error.response.status === 403 || error.response.status === 400)
      	    context.commit('setLoginError',"Invalid login.");
      	  context.commit('setRegisterError',"");
      	  return;
      	}
      	context.commit('setLoginError',"Sorry, your request failed. We will look into it.");
      });
    },
    switchView(context, status) {
      context.commit('setViewingStories', status);
    },
    logout(context,author) {
     context.commit('setAuthor', {});
     context.commit('setToken','');
   },
   getFeed(context) {
      axios.get("/api/authors/" + context.state.author.id + "/stories").then(response => {
	       context.commit('setFeed',response.data.stories);
      }).catch(err => {
	       console.log("getFeed failed:",err);
      });
    },
    getUpdates(context) {
      axios.get("/api/authors/" + context.state.author.id + "/updates").then(response => {
        context.commit('setUpdates', response.data.updates);
      }).catch(err => {
        console.log("getUpdates failed:",err);
      });
    },
    addStory(context,story) {
      axios.post("/api/authors/" + context.state.author.id + "/stories",story,).then(response => {
	       return context.dispatch('getFeed');
      }).catch(err => {
	       console.log("addStory failed:",err);
      });
    },
    updateStory(context,update) {
      axios.post("/api/authors/" + context.state.author.id + "/stories/" + update.id, update).then( response => {
        return context.dispatch('getFeed');
      }).catch(err => {
        console.log("updateStory failed:", err);
      });
    },
    deleteStory(context, story) {
      axios.delete("/api/authors/" + context.state.author.id + "/stories/" + story.id, story).then( response => {
        return context.dispatch('getFeed');
      }).catch(err => {
        console.log("deleteStory failed:", err);
      });
    }
  }
});
