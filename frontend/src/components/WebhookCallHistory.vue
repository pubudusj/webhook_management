<template>
<main>
  <div v-if="message"><div class="alert" :class="'alert alert-'+message.type">{{ message.text }}</div></div>
  <form class="form-webhook" action="#">
    <h1 class="h3 mb-3 fw-normal">List webhook history</h1>
    <div class="form-floating">
      <input v-model="companyId" type="text" class="form-control" id="floatingInput">
      <label for="floatingInput">Company Id</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="button" @click="create">Show Webhook Calls</button>
  </form>
  <table v-if="showDataTable" class="table table-striped">
    <thead>
      <tr>
        <th scope="col">Time</th>
        <th scope="col">Webhook Url</th>
        <th scope="col">Status</th>
        <th scope="col">Payload</th>
        <th scope="col">Additional Info</th>
      </tr>
    </thead>
    <tbody v-if="this.tableData.length > 0">
      <tr v-for="webhookCall in tableData" :key="webhookCall.id">
        <th scope="row">{{ webhookCall.createdAt }}</th>
        <td>{{ webhookCall.url }}</td>
        <td>{{ webhookCall.status }}</td>
        <td class="payload">{{ webhookCall.payload }}</td>
        <td>{{ webhookCall.output !== "{}" ? webhookCall.output : '-' }}</td>
      </tr>
    </tbody>
    <tbody v-if="this.tableData.length === 0">
      <th colspan="5" style="text-align: center">No data found.</th>
    </tbody>
  </table>
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
          message: null,
          tableData: null,
      }
  },
  methods:{
      create(){
        if (!this.companyId) {
          this.message = {
              text: "companyId is required.",
              type: 'danger',
            }
        } else {
          this.submit();
        }
      },
      submit() {
        var self = this;
        axios
          .get(process.env.VUE_APP_API_BASE_URL+'webhook_history/'+this.companyId, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(function(response) {
              console.log(response.data.data)
              self.tableData = response.data.data;
            })
          .catch(function () {
            self.message = {
              text: "Failed fetching webhook data",
              type: 'warning',
            }
          })
      }
  },
  computed: {
    showDataTable: function () {
      return this.tableData != null;
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

.form-webhook {
  width: 50%;
  padding: 15px;
  margin: 20px auto;
}
.form-webhook .checkbox {
  font-weight: 400;
}
.form-webhook .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-webhook .form-control:focus {
  z-index: 2;
}
.form-webhook input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-webhook input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.form-webhook input[type="text"] {
  margin-bottom: 10px;
}

.table {
  font-size: 12px;
  text-align: left;
}
.payload {
  font-size: 10px;
}
</style>
