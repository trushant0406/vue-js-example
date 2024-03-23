import Vue from "vue";

const state = {
    users: [],
    errorMsg: '',
    loading: false,
};

const getters = {
    getUsers: currState => {
        return currState.users;
    },
    getErrorMsg: currState => {
        return currState.errorMsg;
    },
    getLoaddingState: currState => {
        return currState.loading
    }
};

const mutations = {
    addUser: (currState, user) => {
        currState.users.push(user);
    },
    setLoading(currState, payload) {
        currState.loading = payload;
    },
    setUserData: (currState, data) => {
        currState.users = data;
    },
    setError: (currState, errorMsg) => {
        currState.errorMsg = errorMsg;
    },
    updateData: (currState, updatedData) => {
      // Find the index of the data in the state array based on its unique identifier
      const index = currState.users.findIndex(data => data.id === updatedData.id);
      if (index !== -1) {
        // Update the data at the specified index with the updatedData
        Vue.set(currState.users, index, Object.assign({}, currState.users[index], updatedData));
      }
    },
    deleteData: (currState, id) =>{
        currState.users = currState.users.filter(item => item.id !== id);
    }
};

const actions = {
    addUser: ({ commit }, payload) => {
        commit('addUser', payload);
    },
    editUser: ({ commit }, payload) => {
        commit('editUser', payload);
    },

    deleteUser: ({ commit }, payload) => {
        commit('deleteUser', payload);
    },
    setUserData: ({ commit }, payload) => {
        commit('setUserData', payload);
    },
    fetchData({ commit }) {
        commit('setError', null);
        commit('setLoading', true);

        // Make the API call
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(data => {
                commit('setUserData', data);
                commit('setLoading', false);
            })
            .catch(error => {
                commit('setError', error.message);
                commit('setLoading', false);
            });
    },
    async editData({ commit }, {id, newData}) {
        newData.createdAt = new Date();

        try {
          const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
          });
          if (response.ok) {
            const updatedData = await response.json();
            // Handle successful response
            commit('updateData', updatedData);
            // Optionally, you can commit a success message mutation
          }
        } catch (error) {
          // Handle error
          // Optionally, you can commit an error message mutation
          commit('setError', error.message);
        }
      },
      async deleteData({ commit }, id) {
        try {
          const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE'
          });
  
          if (response.ok) {
            commit('deleteData', id);
            // Optionally, you can commit a success message mutation
          }
        } catch (error) {
          // Handle error
          // Optionally, you can commit an error message mutation
          commit('setError', error.message);
        }
      },
      async addItem({ commit }, newItem) {
        newItem.createdAt = new Date();
        try {
          const response = await fetch('http://localhost:3000/users/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
          });
  
          if (response.ok) {
            const addedItem = await response.json();
            commit('addUser', addedItem);
          }
        } catch (error) {
          // Handle error
          // Optionally, you can commit an error message mutation
          commit('setError', error.message);
        }
      }
};

export default {
    state,
    getters,
    mutations,
    actions
};
