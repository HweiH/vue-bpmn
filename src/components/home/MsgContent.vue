<template>
  <div class="msg">
    <h1>{{ msg }}</h1>
    <p>
      <ul>
        <li><router-link to="/new">New Diagram</router-link></li>
        <li><router-link to="/new2">New2 Diagram</router-link></li>
        <li><router-link to="/new3">New3 Diagram</router-link></li>
        <li><router-link to="/view">View Diagram</router-link></li>
      </ul>
    </p>
  </div>
</template>

<script>
export default {
  name: 'MsgContent',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
