<template>
    <v-dialog
      v-model="confirmationDialog"
      :disabled="disabled"
      :width="width"
      :persistent="persistent"
    >
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <slot />
        </div>
      </template>
      <v-card>
        <v-card-title class="grey lighten-2 confirmation-message">
          <span>
            {{ confirmationMessage }}
          </span>
        </v-card-title>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="onConfirm"
          >
            YES
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="onCancel"
          >
            NO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  
  export default {
    name: 'ConfirmationDialog',
    props: {
      confirmationMessage: {
        type: String,
        required: true,
      },
      width: {
        type: String,
        default: '500'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      showDialog: {
        type: Boolean,
        default: false
      },
      persistent: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        confirmationDialog: false,
      };
    },
    watch: {
      showDialog: function () {
        this.confirmationDialog = this.showDialog;
      },
    },
    methods: {
      onConfirm() {
        this.$emit('on-confirm', this.reason);
        this.confirmationDialog = false;
        this.reason = '';
      },
      onCancel() {
        this.$emit('on-cancel');
        this.confirmationDialog = false;
        this.reason = '';
      }
    }
  };
  </script>
  <style scoped>
  .confirmation-message {
    word-break: break-word;
  }
  ::v-deep .v-textarea.v-text-field--enclosed .v-text-field__slot textarea {
    margin: 0px;
  }
  ::v-deep .v-input textarea {
    font-weight: normal;
  }
  </style>
  