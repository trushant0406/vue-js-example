<template>
  <div class="text-center">
    <v-dialog persistent v-model="dialog" width="auto">
      <v-card>
        <v-card-text>
          <v-container class="modal">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-model="editedItem.name" label="Name" :rules="rules"></v-text-field>

              <v-text-field v-model="editedItem.email" label="Email" :rules="rules"></v-text-field>

              <v-text-field v-model="editedItem.mobile" label="Mobile" :rules="rules" type="number"></v-text-field>

              <v-text-field v-model="editedItem.dob" label="DOB" :rules="rules" type="date"></v-text-field>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="onClose"> Cancel </v-btn>
          <v-btn color="blue darken-1" @click="onSave"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'ModalDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    userData: {
      type: Object,
      default: () => {},
    },
    editIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      rules: [(value) => !!value || 'Required.'],
      errors: [],
      valid: true,
      editedItem: {
        name: '',
        email: '',
        mobile: 0,
        dob: 0,
      },
    }
  },
  watch: {
    showDialog: function (newVal) {
      this.dialog = newVal
    },
    userData: function (newVal) {
      this.editedItem = { ...newVal }
    },
  },
  methods: {
    onSave() {
        if (this.$refs.form.validate()) {
            this.$emit('onSave', this.editedItem);
            this.$emit('update-parent-modal', false);
            this.$refs.form.resetValidation();
        }
    },
    onClose() {
      this.$refs.form.resetValidation()
      this.$emit('update-parent-modal', false);
    },
  },
}
</script>

<style>
.modal {
  display: block;
  width: 500px;
  height: 100%;
}
</style>
