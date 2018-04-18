<template>
  <div class="feed">
    <form class="switcher">
      <p><button v-on:click.prevent="switchView" class="primary">View Stories</button>You are viewing your updates.</p>
    </form>
    </br>
    <p>Your update feed:</p>
    <div v-for="item in feed">
      <div class="item">
        <p>You changed the status of <span class="bigData">{{item.title}}</span>
        from <span class="bigData">{{item.old}}</span> to
        <span class="bigData">{{item.new}}</span> {{item.updated | since}} ago.</p>
      </div>
      <br/>
    </div>
  </div>
</template>


<script>
 import moment from 'moment';
 export default {
   name: 'UpdateFeed',
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
     this.$store.dispatch('getUpdates');
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
       return this.$store.getters.updates;
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
        this.$store.dispatch('switchView', true);
     },
   }
 }
</script>



<style scoped>
 .feed {
     width: 900px;
     margin: auto;
 }
 .bigData {
     font-weight: bold;
 }
 .delete {
    margin: auto;
    background-color: #5B88B2;
    display: none;
 }
 .item:hover form p button {
    display: inline;
    margin-right: 50px;
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
     margin-right: 10px;
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
