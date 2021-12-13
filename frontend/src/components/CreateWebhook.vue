<template>
<main class="form-signin">
  <div v-if="message"><div class="alert" :class="'alert alert-'+message.type">{{ message.text }}</div></div>
  <form>
    <h1 class="h3 mb-3 fw-normal">Create a webhook here:</h1>
    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <div class="form-floating">
      <input v-model="companyId" required type="text" class="form-control" id="floatingInput">
      <label for="floatingInput">Company Id</label>
    </div>
    <div class="form-floating">
      <input v-model="event" type="text" class="form-control" id="floatingInput" readonly>
      <label for="floatingPassword">Event</label>
    </div>
    <div class="form-floating">
      <input v-model="url" type="url" class="form-control" id="floatingInput">
      <label for="floatingPassword">Url</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="button" @click="create">Create Webhook</button>
  </form>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CreateWebhook',
  props: {
    msg: String
  },
  data() {
      return {
          companyId: "",
          url: "",
          event: "candidate.created",
          message: null,
      }
  },
  methods:{
      create(){
        if (!this.companyId || !this.url || !this.event) {
          this.message = {
              text: "All fields are required.",
              type: 'danger',
            }
        } else {
          this.submit();
        }
      },
      async submit() {
        var payload = {
          companyId: this.companyId,
          url: this.url,
          eventType: this.event,
        }
        try {
          let response = await axios
            .post(process.env.VUE_APP_API_BASE_URL+'webhooks', payload, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
                this.message = {
                  text: 'Webhook created. Signing token is : ' + response.data.data.token,
                  type: 'success',
                }
         } catch(error) {
            console.log(error.response);
            this.message = {
              text: "Webhook creation failed. Error: " + error.response.data.error,
              type: 'danger',
            }
          }
      }
  }
}
</script>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-align: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  padding: 15px;
  margin: 20px auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.form-signin input[type="text"] {
  margin-bottom: 10px;
}

.form-signin input[type="url"] {
  margin-bottom: 10px;
}
</style>
