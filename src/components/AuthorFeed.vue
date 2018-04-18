<template>
  <div class="feed">
    <form class="switcher">
      <p>You are viewing your stories. <button v-on:click.prevent="switchView" class="primary">View Updates</button> </p>
    </form>
    <div>
      <form v-on:submit.prevent="story" class="storyForm">
        <p>Add a new story by filling out the fields below</p>
        <input class="wide" v-model="title" placeholder="Title">
        <input class="wide" v-model="genre" placeholder="Genre">
        <br/>
        <input class="wide" v-model="link" placeholder="Link (Where can your followers read your story?)">
        <input class="wide" v-model="status" placeholder="Status (Planning, Writing, Editing, or Finished)">
        <br/>
      	<div class="buttonWrap">
      	  <button class="primary" type="submit">Post Story</button>
      	</div>
      </form>
    </div>
    <br/>
    <p>Your stories:</p>
    <div v-for="item in feed">
      <div class="item">
        <button v-on:click.prevent="deleteStory(item)" class="delete">Delete</button>
        <p><span class="title">Title: {{item.title}}</span><span class="genre">Genre: {{item.genre}}</span></p>
        <p><a :href="'http://' + item.link"><span class="link">{{item.link}}</span></a><span class="status">Status: {{item.status}}</span></p>
        <form v-on:submit.prevent="update(item)" class="updateForm">
          <span class="handle">posted by {{item.username}}</span><input :id="item.id" class="narrow" placeholder="Update Status">
        </form>
      </div>
      <br/>
    </div>
  </div>
</template>


<script>
 import moment from 'moment';
 export default {
   name: 'AuthorFeed',
   data () {
     return {
       title: '',
       genre: '',
       link: '',
       status: '',
       newStatus: '',
     }
   },
   created: function() {
     this.$store.dispatch('getFeed');
   },
   filters: {
     since: function(datetime) {
       moment.locale('en', {
      	 relativeTime: {
      	   future: 'in %s',
      	   past: '%s',
      	   s:  'seconds',
      	   ss: '%ss',
      	   m:  '1m',
      	   mm: '%dm',
      	   h:  'h',
      	   hh: '%dh',
      	   d:  'd',
      	   dd: '%dd',
      	   M:  ' month',
      	   MM: '%dM',
      	   y:  'a year',
      	   yy: '%dY'
      	 }
       });
       return moment(datetime).fromNow();
     },
   },
   computed: {
     feed: function() {
       return this.$store.getters.feed;
     },
   },
   methods: {
     story: function() {
       this.$store.dispatch('addStory',{
         title: this.title,
         genre: this.genre,
         link: this.link,
         status: this.status,
       }).then(story => {
	         this.title = "";
           this.genre = "";
           this.link = "";
           this.status = "";
       });
     },
     update: function(story) {
        let docID = story.id;
        this.$store.dispatch('updateStory', {
          id: story.id,
          newStatus: document.getElementById(story.id).value,
        }).then(story => {
          document.getElementById(docID).value = "";
        });
     },
     deleteStory: function(story) {
        document.getElementById(story.id).disabled = true;
        this.$store.dispatch('deleteStory', {
          id: story.id,
        }).then(story => {

        });
     },
     switchView: function() {
        this.$store.dispatch('switchView', false);
     }
   }
 }
</script>



<style scoped>
 .feed {
     width: 900px;
     margin: auto;
 }
 .delete {
    margin: auto;
    background-color: #5B88B2;
    display: none;
 }
 .item:hover button {
    display: inline;
    margin: 0px;
    margin-left: 30px;

 }
 .storyForm {
     background: #E9F1FF;
     padding: 10px;
     margin-bottom: 10px;
     border-style: solid;
     border-width: 5px;
 }
 .buttonWrap {
     width: 100%;
     display: flex;
 }
 button {
     margin-left: auto;
     height: 2em;
     font-size: 0.9em;
 }
 textarea {
     width: 100%;
     height: 5em;
     padding: 2px;
     margin-bottom: 5px;
     resize: none;
     box-sizing: border-box;
 }
 .item {
     border-bottom: 1px solid #ddd;
     padding: 10px;
     background-color: #E9F1FF;
 }
 .item p {
    padding-left: 20px;
    padding-right: 20px;
    font-size: 24px;
 }
 .tweet {
     margin-top: 0px;
 }
 .idline {
     margin-bottom: 0px;
 }
 .updateForm {
     overflow: hidden;
 }
 .narrow {
     width: 167px;
     float: right;
     clear: both;
 }
 .wide {
     width: 370px;
 }
 .user {
     font-weight: bold;
     margin-right: 10px;
 }
 .handle {
     margin-left: 20px;
     color: #666;
 }
 .time {
     float: right;
     color: #666;
 }
 .genre {
    text-align: right;
    display: block;
    float: right;
 }
 .status {
    text-align: right;
    display: block;
    float: right;
 }
 .switcher {
    text-align: center;
 }
 .switcher p button {
    margin-left: 30px;
    margin-right: 30px;
 }
</style>
