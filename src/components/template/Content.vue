<template>
  <div class="q-pa-xs tarefa">
        <Tasks ref="task" />
  </div>
</template>

<script>
import Tasks from '../tables/Tasks'

export default {
    name: 'Conteudo',
    components: { Tasks },
    methods: {
        async updateTable () {
            await this.$refs.task.loaderItems()
        }
    }
}
</script>

<style>
    .tarefa {
        width: 100%;
    }
</style>
