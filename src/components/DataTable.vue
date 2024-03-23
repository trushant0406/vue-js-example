<template>
  <v-container>
    <v-row class="d-flex justify-space-between mb-2">
      <v-col>
        <v-text-field
          v-model="search"
          @input="updateSearch"
          placeholder="Search by Name, Email, Mobile Number"
          hide-details
          outlined
          flat
          dense
          solo
        >
        </v-text-field>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn color="primary" @click="addNewUser"> Add New User </v-btn>
      </v-col>
    </v-row>
    <v-data-table 
    :headers="headers" 
    :items="items" 
    :loading="isLoading" 
    :search="search"
    :sort-by="['createdAt']"
    :sort-desc="true"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <div class="d-flex">
          <v-btn color="primary" class="mr-6" @click="editUser(item, item.id)"> Edit </v-btn>
          <confirmation-modal :confirmationMessage="`Are you sure you want to delete the user?`" :persistent="true"  @on-confirm="clearBuffer(item.id)">
          <v-btn  color="red" > Delete </v-btn>
        </confirmation-modal>
        </div>
      </template>
    </v-data-table>
    <modal-dialog
      :showDialog="showModal"
      :userData="userData"
      :editIndex="editIndex"
      @onSave="onSave"
      @update-parent-modal="(val) => (this.showModal = val)"
    />
  </v-container>
</template>

<script>
import _ from 'lodash'
import { headers } from '../const'

import ModalDialog from './model/ModalDialog.vue' 
import ConfirmationModal from './model/ConfirmationModal.vue';
export default {
  data() {
    return {
      headers,
      showModal: false,
      userData: {},
      editIndex: -1,
      search: '',
      filteredItems: []
    }
  },
  components: {
    ModalDialog,
    ConfirmationModal
  },
  mounted() {
    this.$store.dispatch('fetchData');
  },
  computed: {
    items() {
      return this.$store.getters.getUsers;
    },
    error() {
      return this.$store.getters.getErrorMsg;
    },
    isLoading() {
      return this.$store.getters.getLoaddingState
    },
    showSearchHint() {
      return this.search.length < 3 ? `Enter at least 3 characters` : '';
    },
  },
  methods: {
    onSave(editedItem) {
        this.showModal = true;
        if (this.editIndex == -1) {
          this.addItem(editedItem);
          return;
        }
        this.updateData(this.editIndex, editedItem);
    },
    async addItem(newItem) {
      try {
        await this.$store.dispatch('addItem', newItem)
        // Item successfully added, perform any additional actions
      } catch (error) {
        // Error occurred while adding item, handle the error
      }
    },
    async updateData(id, newData) {
      try {
        await this.$store.dispatch('editData', { id, newData })
        // Data successfully updated, perform any additional actions
      } catch (error) {
        // Error occurred while updating data, handle the error
      }
    },
    addNewUser() {
      this.showModal = true
      this.editIndex = -1;
      this.userData = { };
    },
    editUser(item, index) {
      this.showModal = true
      this.userData = { ...item }
      this.editIndex = index
    },
    clearBuffer(id) {
        this.deleteItem(id);
    },
    async deleteItem(id) {
      try {
        await this.$store.dispatch('deleteData', id)
        // Data successfully deleted, perform any additional actions
      } catch (error) {
        // Error occurred while deleting data, handle the error
      }
    },
    updateSearch: _.debounce(function() {
      const query = this.search.toLowerCase().trim();
      if (query.length >= 3) {
        this.filteredItems =  this.$store.getters.getUsers.filter(item => {
          const name = item.name.toLowerCase();
          const email = item.email.toLowerCase();
          const mobile = item.mobile.toLowerCase();

          return name.includes(query) || email.includes(query) || mobile.includes(query);
        });
      } else {
        this.filteredItems = this.items;
      }
    }, 1000),
  },
}
</script>

<style scoped>
.v-data-table {
  border: 0.5px solid rgba(0, 0, 0, 0.22);
}
.v-data-table ::v-deep th {
  font-size: 14px !important;
  line-height: 18px;
  font-weight: 400 !important;
  color: #000000 !important;
}
.v-data-table ::v-deep td {
  font-size: 14px;
  height: 42px !important;
  color: #484964;
}
.v-data-table ::v-deep tr:hover:not(.bg-color) {
  background: #f9f9fc !important;
}
::v-deep .v-data-table__wrapper {
  border-radius: 8px;
}
.bg-color {
  background-color: #f1f1f1;
}
</style>
