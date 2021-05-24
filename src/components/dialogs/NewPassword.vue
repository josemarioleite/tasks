<template>
    <q-dialog v-model="showDialog" persistent class="modal">
        <q-layout view="Lhh lpR fff" container class="bg-dark">
            <q-header class="row bg-primary" style="padding: 5px">
                <q-toolbar-title>Nova Senha</q-toolbar-title>
                <q-btn @click="openDialog" flat dense icon="close" align="right" />
            </q-header>

            <q-page-container>
                <q-page>

                </q-page>
            </q-page-container>

            <q-footer>

            </q-footer>
        </q-layout>
    </q-dialog>
</template>

<script>
export default {
    name: 'New-Password',
    data () {
        return {
            showDialog: false
        }
    },
    methods: {
        openDialog () {
            this.showDialog = !this.showDialog
        }
    }
}
</script>

<style scoped>
    .modal {
        height: 60vh;
    }
</style>