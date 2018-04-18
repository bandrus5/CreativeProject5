<template>
  <div>
    <h1>Author Space</h1>
    <h2>Record your stories. Track your progress. See results.</h2>
    <form v-on:submit.prevent="register">
      <p>Sign up for your free account:</p>
      <input class="narrow" v-model="username" placeholder="User Name">
      <input class="narrow" type="password" v-model="password" placeholder="Password">
      <br/>
      <input class="wide" v-model="name" placeholder="First and Last Name">
      <br/>
      <button class="primary" type="submit">Register</button>
    </form>
    <p class="error">{{registerError}}</p>
  </div>
</template>


<script>
 export default {
   name: 'WelcomePage',
   data () {
     return {
       username: '',
       name: '',
       password: '',
       location: '',
     }
   },
   computed: {
     registerError: function() {
       return this.$store.getters.registerError;
     },
   },
   methods: {
     register: function() {
       var gender = 'None';
       this.$store.dispatch('register',{
	       username: this.username,
         gender: gender,
         password: this.password,
	       name: this.name,
         location: "na",
       });
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 img {
     width: 100px;
 }

 h1 {
     margin-bottom: 0px;
     text-align: center;
 }
 h2 {
     margin-top: 0px;
     font-size: 1.2em;
     font-weight: normal;
     margin-bottom: 50px;
     text-align: center;
 }
 form {
     text-align: center;
 }
 .narrow {
     width: 167px;
 }
 .wide {
     width: 370px;
 }
</style>
