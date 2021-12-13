<template>
<main class="form-signin">
  <div v-if="message"><div class="alert" :class="'alert alert-'+message.type">{{ message.text }}</div></div>
  <form>
    <h1 class="h3 mb-3 fw-normal">Create a candidate</h1>
    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <div class="form-floating">
      <input v-model="companyId" type="text" class="form-control" id="floatingInput">
      <label for="floatingInput">Company Id</label>
    </div>
    <div class="form-floating">
      <input v-model="email" type="text" class="form-control" id="floatingInput">
      <label for="floatingInput">Email</label>
    </div>
    <div class="form-floating">
      <input v-model="firstName" type="text" class="form-control" id="floatingInput">
      <label for="floatingInput">First name</label>
    </div>
    <div class="form-floating">
      <input v-model="lastName" type="text" class="form-control" id="floatingInput">
      <label for="floatingInput">Last name</label>
    </div>
    <div class="form-floating">
      <input v-model="location" type="text" class="form-control" id="floatingInput">
      <label for="floatingInput">Location</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="button" @click="create">Create Candidate</button>
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
          email: "",
          firstName: "",
          lastName: "",
          location: "",
          message: null
      }
  },
  methods:{
      create(){
          if (!this.companyId || !this.email || !this.firstName) {
          this.message = {
              text: "Company Id, Email, First Name fields are required.",
              type: 'danger',
            }
        } else {
          this.submit();
        }
      },
      submit() {
        var self = this;
        var payload = {
          companyId: this.companyId,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          location: this.location,
        }
        axios
          .post(process.env.VUE_APP_API_BASE_URL+'candidates', payload, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(function(response) {
              self.message = {
                text: 'Candidate created. Id: ' + response.data.data.id,
                type: 'success',
              }
            })
          .catch(function (response) {
            self.message = {
              text: "Candidate creation failed. Error: " + response.data.error,
              type: 'warning',
            }
          })
          console.log(this, self)
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
</style>
