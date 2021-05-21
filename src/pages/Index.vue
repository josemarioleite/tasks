<template>
  <q-layout class="flex flex-start">
    <Header class="relativa" />
    <Content class="absolute conteudo" ref="content" />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn @click="newTask" round color="green" icon="add">
            <q-tooltip anchor="center left" self="center end">Adicionar nova tarefa</q-tooltip>
        </q-btn>
    </q-page-sticky>
    <NewTask ref="newTask" @updateTable="updateTable" />
  </q-layout>
</template>

<script>
import Header from 'src/components/template/Header.vue'
import Content from 'src/components/template/Content.vue'
import NewTask from 'src/components/dialogs/NewTask.vue'

export default {
  name: 'PageIndex',
  components: {
    Header, Content, NewTask
  },
  methods: {
    newTask () {
      this.$refs.newTask.openDialog('S')
    },
    updateTable () {
      this.$refs.content.updateTable()
    }
  }
}
</script>

<style scoped>
  .conteudo {
    margin-top: 50px;
  }
</style>
