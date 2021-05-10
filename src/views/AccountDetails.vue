<template>
  <v-container>
    <v-row class="justify-center">
      <v-col lg="5" md="10" sm="12" v-if="error">
        <v-alert type="error">{{ error }}</v-alert>
      </v-col>

      <v-col lg="5" md="10" sm="12" v-if="loading">
        <v-skeleton-loader
          type="card-avatar, article, actions"
        ></v-skeleton-loader>
      </v-col>
      <v-col lg="5" md="10" sm="12" v-if="account">
        <v-card>
          <v-img
            class="teal white--text align-end"
            height="200px"
            src="@/assets/user.png"
            contain
          >
            <v-card-title
              >{{ account.debtor.title }} {{ account.debtor.firstName }}
              {{ account.debtor.lastName }}</v-card-title
            >
          </v-img>
          <v-card-text class="text--primary subtitle-1">
            <div>
              <span class="grey--text body-2">Phone:</span>
              {{ account.debtor.mobilePhone }}
            </div>
            <div>
              <span class="grey--text body-2">Email:</span>
              {{ account.debtor.email }}
            </div>
          </v-card-text>
          <v-card-subtitle class="pt-0 pb-2"> Address: </v-card-subtitle>
          <v-card-text class="text--primary subtitle-2">
            <div>{{ account.debtor.address.address }}</div>
            <div>
              {{ account.debtor.address.city }},
              {{ account.debtor.address.state }} -
              {{ account.debtor.address.zip }}
            </div>
            <div>{{ account.debtor.address.country }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              small
              plain
              color="warn"
              :to="{ name: 'Accounts' }"
              class="mr-3"
            >
              Back
            </v-btn>

            <v-speed-dial v-model="dialShare" direction="right">
              <template v-slot:activator>
                <v-btn fab bottom icon small color="teal" dark>
                  <v-icon v-if="dialShare">fa-times</v-icon>
                  <v-icon v-else>fa-share-alt</v-icon>
                </v-btn>
              </template>
              <v-btn
                dark
                fab
                bottom
                color="green"
                small
                :href="`https://wa.me/?text=${pageURL}`"
                target="_blank"
              >
                <v-icon>fa-whatsapp</v-icon>
              </v-btn>
              <v-btn
                dark
                fab
                bottom
                color="blue"
                small
                target="_blank"
                :href="`mailto:?subject=Account Details!body=Checkout this page: <a href='${pageURL}'>${pageURL}</a>`"
              >
                <v-icon>fa-envelope-o</v-icon>
              </v-btn>
            </v-speed-dial>

            <v-spacer></v-spacer>

            <v-btn icon @click="expanded = !expanded">
              <v-icon>{{ expanded ? "fa-angle-up" : "fa-angle-down" }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="expanded">
              <v-divider></v-divider>
              <v-subheader>Claims</v-subheader>
              <v-card-text class="pt-2">
                <v-divider></v-divider>
                <v-card
                  flat
                  v-for="claim in claims"
                  :key="claim.id"
                  rounded="0"
                >
                  <v-layout>
                    <v-flex xs12 md4 class="pa-2">
                      <div class="caption grey--text">Due</div>
                      <div>{{ claim.dueDate }}</div>
                    </v-flex>
                    <v-flex xs12 md4 class="pa-2">
                      <div class="caption grey--text">Status</div>
                      <div
                        :class="
                          claim.status === 'OPEN'
                            ? 'orange--text'
                            : claim.status === 'PAID'
                            ? 'teal--text'
                            : 'red--text'
                        "
                      >
                        {{
                          claim.status.charAt(0).toUpperCase() +
                          claim.status.substr(1).toLowerCase()
                        }}
                      </div>
                    </v-flex>
                    <v-flex xs12 md4 class="pa-2">
                      <div class="caption grey--text">Amount</div>
                      <div>&euro;{{ claim.baseAmount }}</div>
                    </v-flex>
                  </v-layout>
                  <v-divider></v-divider>
                </v-card>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { Account } from "@/models/account";
import { Claim } from "@/models/claim";

@Component
export default class AccountDetails extends Vue {
  loading = false;
  account: Account | null = null;
  error: string | null = null;
  expanded = false;
  claims: Claim[] = [];
  dialShare = false;
  pageURL = "";

  created(): void {
    this.getAccount();
    this.pageURL = window.location.href;
  }

  getAccount(): void {
    this.error = this.account = null;
    this.loading = true;
    const fetchedId = this.$route.params.id;

    axios
      .get<Account>(`http://localhost:9001/accounts/${fetchedId}`)
      .then(({ data }) => {
        setTimeout(() => {
          this.account = data;
          this.loading = false;
          this.getClaims();
        }, 1000);
      })
      .catch((error) => {
        this.error = error.message;
        this.loading = false;
      });
  }

  getClaims() {
    axios
      .get<Claim[]>(`http://localhost:9001/claims`)
      .then(({ data }) => {
        this.claims = data
          .filter((d) => d.accountId === this.account?.id)
          .map((d) => {
            return {
              ...d,
              baseAmount: d.baseAmount / 100,
              fees: d.fees / 100,
            };
          })
          .sort((a, b) =>
            a.dueDate > b.dueDate ? -1 : a.dueDate < b.dueDate ? 1 : 0
          );

        this.expanded = true;
      })
      .catch((error) => {
        this.error = error.message;
      });
  }
}
</script>
