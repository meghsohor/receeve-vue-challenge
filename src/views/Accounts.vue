<template>
  <v-container>
    <v-layout row>
      <v-col xs="12" v-if="loading">
        <v-row>
          <v-col md="4" sm="6" cols="12">
            <v-skeleton-loader type="article, actions"></v-skeleton-loader>
          </v-col>
          <v-col md="4" sm="6" cols="12">
            <v-skeleton-loader type="article, actions"></v-skeleton-loader>
          </v-col>
          <v-col md="4" sm="6" cols="12">
            <v-skeleton-loader type="article, actions"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-col>

      <v-flex
        xs12
        md4
        sm6
        class="pa-3"
        v-for="account in accounts"
        :key="account.id"
      >
        <v-card class="pa-3 pb-1">
          <v-list-item three-line>
            <v-list-item-content>
              <!-- <div class="overline mb-4">OVERLINE</div> -->
              <v-list-item-title class="headline mb-2">
                {{ account.debtor.title }} {{ account.debtor.firstName }}
                {{ account.debtor.lastName }}
              </v-list-item-title>
              <v-list-item-subtitle>{{
                account.debtor.mobilePhone
              }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{
                account.debtor.email
              }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="60" color="teal" class="justify-center"
              ><div class="text-h5 white--text">
                {{ account.debtor.firstName.substr(0, 1)
                }}{{ account.debtor.lastName.substr(0, 1) }}
              </div></v-list-item-avatar
            >
          </v-list-item>

          <v-card-actions class="mt-4">
            <v-btn
              text
              color="teal"
              :to="{ name: 'AccountDetails', params: { id: account.id } }"
            >
              View Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios from "axios";
import { Account } from "@/models/account";

@Component
export default class Accounts extends Vue {
  @Prop()
  msg!: string;
  accounts: Account[] = [];
  loading = false;
  error: string | null = null;

  mounted() {
    this.getAccounts();
  }

  getAccounts(): void {
    this.loading = true;
    this.accounts = [];
    this.error = null;

    axios
      .get<Account[]>("http://localhost:9001/accounts")
      .then(({ data }) => {
        setTimeout(() => {
          this.accounts = data;
          this.loading = false;
        }, 1000);
      })
      .catch((error) => {
        this.error = error.message;
        this.loading = false;
      });
  }
}
</script>