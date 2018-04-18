<template>
  <div>
    <div v-if="loggedIn">
      <div v-if="viewingStories">
        <author-feed/>
      </div>
      <div v-else>
        <update-feed/>
      </div>
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
 import WelcomePage from './WelcomePage';
 import AuthorFeed from './AuthorFeed';
 import UpdateFeed from './UpdateFeed';
 export default {
   name: 'HomePage',
   components: {WelcomePage,AuthorFeed,UpdateFeed},
   computed: {
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
     viewingStories: function() {
       return this.$store.getters.viewingStories;
     },
   },
 }
</script>

<style scoped>
div {
  background-color: #0085FF;
  padding: 20px;
}
</style>
