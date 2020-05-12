<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <MsgContent msg="Welcome to Your Vue.js App powered by bpmn.js integrated with Activiti"/>
  </div>
</template>

<script>
// @ is an alias to /src
import MsgContent from '@/components/home/MsgContent.vue'

export default {
  name: 'Home',
  components: {
    MsgContent
  }
}
</script>
