<template>
    <q-dialog v-model="showDialog" persistent>
        <q-layout view="Lhh lpR fff" container class="bg-dark container">
            <q-header class="row bg-primary" style="padding: 5px">
                <q-toolbar-title>Nova Senha</q-toolbar-title>
                <q-btn @click="openDialog" flat dense icon="close" align="right" />
            </q-header>

            <q-page-container>
                <q-page>
                    <div class="row col-12 q-pa-sm">
                        <q-input type="password" class="col-12 q-pa-sm" :error="errorPassword" dark v-model="password" outlined label-color="white" color="purple" label="Nova Senha" />
                        <q-input type="password" class="col-12 q-pa-sm" :error="errorConfirmPassword" dark v-model="confirmPassword" outlined label-color="white" color="purple" label="Confirme Nova Senha" />
                    </div>
                    <div class="col-12 q-mt-xs q-pr-sm row justify-end items-center text-white">
                        <div>Primeiro Acesso:</div>
                        <q-checkbox dark v-model="first" />
                    </div>
                </q-page>
            </q-page-container>

            <q-footer class="transparent q-pa-md">
                <div class="row justify-center">
                    <q-btn @click="openDialog" icon="close" color="red" label="Fechar" />
                    <q-btn @click="newPassword" icon="save" color="green" label="Salvar" class="q-ml-sm" />
                </div>
            </q-footer>
        </q-layout>
    </q-dialog>
</template>

<script>
import { Patch } from 'src/utils/Conexao.js'

export default {
    name: 'New-Password',
    data () {
        return {
            idUser: null,
            first: false,
            errorPassword: false,
            password: null,
            errorConfirmPassword: false,
            confirmPassword: null,
            showDialog: false
        }
    },
    methods: {
        message (msg, color) {
            this.$q.notify({
                message: msg,
                color: color,
                timeout: 500
            })
        },
        cleanFields () {
            this.password = null
            this.confirmPassword = null
            this.first = false
        },
        openCloseDialog (idUser) {
            this.showDialog = !this.showDialog
            this.idUser = idUser
        },
        openDialog () {
            this.showDialog = !this.showDialog
            this.cleanFields()
        },
        verifyFields () {
            return new Promise(resolve => {
                var emptyField = false

                if (this.password === null || this.password === '' || this.password === undefined) {
                    this.errorPassword = true
                    emptyField = true
                } else {
                    this.errorPassword = false
                    emptyField = false
                }

                if (this.confirmPassword === null || this.confirmPassword === '' || this.confirmPassword === undefined) {
                    this.errorConfirmPassword = true
                    emptyField = true
                } else {
                    this.errorConfirmPassword = false
                    emptyField = false
                }

                if (emptyField === false) {
                    resolve(true)
                }
            })
        },
        newPassword () {
            this.verifyFields().then(res => {
                if (this.password === this.confirmPassword) {
                    this.message('Carregando...', 'blue')
                    setTimeout(() => {
                        var pwd = Object()
                        pwd.id = Number(this.idUser)
                        pwd.senha = this.confirmPassword
                        if (this.first === false) {
                            pwd.primeiroacesso = 'N'
                        } else {
                            pwd.primeiroacesso = 'S'
                        }

                        Patch('v1/usuario/alterasenha', pwd).then(res => {
                            if (res.data.status === true) {
                                this.message(res.data.msg, 'positive')
                                this.openDialog()
                                setTimeout(() => {
                                    this.message('Faça login com sua nova senha', 'blue')
                                }, 2000)
                            } else {
                                this.message(res.data.msg, 'negative')
                            }
                        }).catch(err => {
                            console.log(err)
                            this.message('Não foi possível alterar senha', 'red')
                            this.openDialog()
                        })
                    }, 1500)
                } else {
                    this.message('As senhas não conferem', 'red')
                }
            })
        }
    }
}
</script>

<style scoped>
    .container {
        height: 350px;
    }

    .modal {
        height: 60vh;
    }
</style>