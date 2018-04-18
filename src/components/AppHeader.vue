<template>
  <nav>
    <ul id="menu">
      <li class="right" v-if="loggedIn"><button class="primary" v-on:click="logout">Logout</button></li>
      <li class="name" v-if="loggedIn">{{author.name}}</li>
      <form v-else class="right" v-on:submit.prevent="login">
      	<input v-model="username" placeholder="User Name">
      	<input v-model="password" type="password" placeholder="Password">
      	<button class="primary" type="submit">Login</button>
      </form>
    </ul>
    <div class="flexWrapper errorPlace">
      <p v-if="loginError" class="flexRight error">{{loginError}}</p>
    </div>
  </nav>
</template>


<script>
 export default {
   name: 'AppHeader',
   data () {
     return {
       username: '',
       password: '',
     }
   },
   computed: {
     author: function() {
       return this.$store.getters.author;
     },
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
     loginError: function() {
       return this.$store.getters.loginError;
     },
   },
   methods: {
     login: function() {
       this.$store.dispatch('login',{
         username: this.username,
         password: this.password,
       }).then(author => {
      	 this.username = '';
      	 this.password = '';
       });
     },
     logout: function() {
       this.$store.dispatch('logout');
     }
   }
 }
</script>


<style scoped>
 /* Strip the ul of padding and list styling */
 nav {
     display: grid;
     margin-bottom: 20px;
     padding: 20px;
     background-color: #5B88B2;
 }
 ul {
     list-style-type:none;
     margin:0;
     padding:0;
 }
 /* Create a horizontal list with spacing */
 li {
     display:inline-block;
     float: left;
     margin-right: 20px;
     height: 50px;
     text-align: center;
     line-height: 50px;
     color: #666;
 }
 /*Active color*/
 li a.active {
 }
 /*Hover state for top level links*/
 li:hover a {
 }
 .right {
     float: right;
 }
 .name {
    color: black;
    padding-left: 150px;
 }
 .errorPlace {
     height: 20px;
 }
 img {
     width: 50px;
 }
</style>
