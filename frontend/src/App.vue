<template>
  <div class="container">
    <h3>Webhook Management with Serverless</h3>
  <div class="row">
    <div class="col-sm">
      <CreateWebhook />
    </div>
    <div class="col-sm">
      <CreateCandidate />
    </div>
    <hr />
    <div class="col-sm">
      <WebhookCallHistory />
    </div>
  </div>
</div>
</template>

<script>
import CreateCandidate from './components/CreateCandidate.vue'
import CreateWebhook from './components/CreateWebhook.vue'
import WebhookCallHistory from './components/WebhookCallHistory.vue'

export default {
  name: 'App',
  components: {
    CreateWebhook,
    CreateCandidate,
    WebhookCallHistory,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
