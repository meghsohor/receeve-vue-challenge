<template>
  <v-container style="height: 100%">
    <v-row class="justify-center" style="height: 100%">
      <v-col sm="12">
        <v-sheet rounded="lg" class="pa-md-8 pa-4" height="100%">
          <v-divider class="mt-3"></v-divider>

          <v-card class="p-0" flat rounded="0">
            <v-layout>
              <v-flex xs4 class="pa-3">
                <div class="d-flex">
                  <div class="mr-auto pr-2">
                    <div class="caption grey--text">Total Due</div>
                    <div>&euro;{{ totalDue.toFixed(2) }}</div>
                  </div>
                  <v-divider vertical></v-divider>
                </div>
              </v-flex>
              <v-flex xs4 class="pa-3">
                <div class="d-flex">
                  <div class="mr-auto pr-2">
                    <div class="caption grey--text">Total Claim</div>
                    <div>&euro;{{ totalClaim.toFixed(2) }}</div>
                  </div>
                  <v-divider vertical></v-divider>
                </div>
              </v-flex>
              <v-flex xs4 class="pa-3">
                <div class="caption grey--text">Total Deleted</div>
                <div>&euro;{{ totalDeleted.toFixed(2) }}</div>
              </v-flex>
            </v-layout>
          </v-card>

          <v-divider></v-divider>

          <v-card-title class="px-0">
            <v-row>
              <v-col sm="6" md="8" cols="12" class="d-flex align-center pb-0">
                Claims
              </v-col>
              <v-col sm="6" md="4" cols="12">
                <v-text-field
                  v-model="search"
                  append-icon="fa-search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-title>

          <v-divider></v-divider>

          <v-data-table
            :headers="tableHeaders"
            :items="claims"
            :items-per-page="20"
            class="elevation-1"
            :loading="loading"
            loading-text="Loading... Please wait"
            :search="search"
            :footer-props="{
              itemsPerPageOptions: [10, 20, 50, -1],
            }"
          >
            <template v-slot:[`item.baseAmount`]="{ item }"
              >&euro;{{ item.baseAmount }}</template
            >
            <template v-slot:[`item.fees`]="{ item }"
              >&euro;{{ item.fees }}</template
            >
            <template v-slot:[`item.status`]="{ item }"
              ><v-chip :color="getColor(item.status)" dark>
                {{
                  item.status.charAt(0).toUpperCase() +
                  item.status.substr(1).toLowerCase()
                }}
              </v-chip></template
            >
          </v-data-table>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios from "axios";
import { Claim } from "@/models/claim";

@Component
export default class Dashboard extends Vue {
  @Prop()
  msg!: string;
  loading = false;
  claims: Claim[] = [];
  error: string | null = null;
  totalDue = 0;
  totalClaim = 0;
  totalDeleted = 0;
  search = "";

  tableHeaders = [
    { text: "Status", value: "status" },
    { text: "Due Date", value: "dueDate" },
    { text: "Amount", value: "baseAmount" },
    { text: "Fees", value: "fees" },
    { text: "Paid Date", value: "paidAt" },
    { text: "Deleted Date", value: "deletedAt" },
  ];

  created(): void {
    this.getClaims();
  }

  getClaims() {
    this.error = null;
    this.claims = [];
    this.loading = true;

    axios
      .get<Claim[]>(`http://localhost:9001/claims`)
      .then(({ data }) => {
        setTimeout((): void => {
          this.claims = data
            .map((d) => {
              if (d.status === "OPEN") {
                this.totalDue = this.totalDue + d.baseAmount / 100;
              } else if (d.status === "PAID") {
                this.totalClaim = this.totalDue + d.baseAmount / 100;
              } else {
                this.totalDeleted = this.totalDue + d.baseAmount / 100;
              }

              return {
                ...d,
                baseAmount: d.baseAmount / 100,
                fees: d.fees / 100,
              };
            })
            .sort((a, b) =>
              a.dueDate > b.dueDate ? 1 : a.dueDate < b.dueDate ? -1 : 0
            );
          this.loading = false;
        }, 1000);
      })
      .catch((error) => {
        this.error = error.message;
        this.loading = false;
      });
  }

  getColor(status: string): string {
    if (status === "DELETED") return "red";
    else if (status === "OPEN") return "orange";
    else return "teal";
  }
}
</script>