<template>
  <div class="home">
    <a href="https://github.com/HweiH/vue-bpmn" target="_blank" rel="noopener"><img alt="Vue logo" src="../assets/logo.png"></a>
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
