<template>
    <q-dialog v-model="show" persistent class="dialog">
        <q-layout view="Lhh lpR fff" container class="bg-dark">
            <q-header class="row bg-primary" style="padding: 5px">
                <q-toolbar-title>Nova Tarefa</q-toolbar-title>
                <q-btn @click="openDialog" flat dense icon="close" align="right" />
            </q-header>

            <q-page-container>
                <q-page padding>
                    <div class="row col-12">
                        <div class="q-mb-sm row col-12">
                            <q-input :error="errorNameTask" class="col-7 inputs" label-color="white" dark outlined v-model="nameTask" label="Nome" />
                            <q-input :error="errorIdTask" class="col-5 inputs" label-color="white" dark outlined v-model="idTask" label="ID da Tarefa">
                                <template v-slot:append>
                                    <q-icon name="get_app" @click="getDataTask" />
                                </template>
                            </q-input>
                        </div>
                        <div class="q-mb-sm row col-12">
                            <q-select :error="errorTypeSelected" class="col-7 inputs" label-color="white" dark outlined v-model="typeSelected" :options="typeOptions" option-label="nome" option-value="id" label="Tipo" />
                            <q-select :error="errorFrameSelected" class="col-5 inputs" label-color="white" dark outlined v-model="frameSelected" :options="frameOptions" option-label="nome" option-value="id" label="Quadro" />
                        </div>
                        <div class="row col-12">
                            <q-select
                                @filter="filterClient"
                                :options="filterClientOptions"
                                :error="errorClientSelected"
                                option-value="id"
                                option-label="name"
                                label-color="white"
                                class="inputs col-7"
                                dark
                                use-input
                                hide-selected
                                fill-input
                                outlined
                                v-model="clientSelected"
                                label="Selecionar Projeto"
                            >              
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            <div class="row items-center">
                                                <q-icon class="q-mr-xs" name="sentiment_dissatisfied" color="brown" size="15px"/>Sem Resultados
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                            <q-input :error="errorDateTask" class="col-5 inputs" outlined label="Data" label-color="white" dark v-model="dateTask" mask="##/##/####" :rules="['date']">
                                <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                            <q-date v-model="dateTask" mask="DD-MM-YYYY">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                    </div>
                </q-page>
            </q-page-container>
            <q-footer class="bg-dark">
                <div class="row justify-center q-pa-sm">
                    <q-btn label="Fechar" class="q-mr-sm" color="red" @click="openDialog" />
                    <q-btn label="Salvar" color="green" @click="addNewTask" />
                </div>
            </q-footer>
        </q-layout>
    </q-dialog>
</template>

<script>
import { Get, Post } from 'src/utils/Conexao.js'
import { ConverteStringPraDatetime, ConverteDatetimePraString } from 'src/utils/Dates.js'

export default {
    name: 'Dialog-NewTask',
    data () {
        return {
            idTask: null,
            errorIdTask: false,
            nameTask: null,
            errorNameTask: false,
            dateTask: '',
            errorDateTask: false,
            titleDialog: '',
            typeOptions: [],
            frameOptions: [],
            clientOptions: [],
            filterClientOptions: [],
            errorClientSelected: false,
            clientSelected: null,
            errorTypeSelected: false,
            typeSelected: null,
            errorFrameSelected: false,
            frameSelected: null,
            show: false
        }
    },
    methods: {
        cleanDatas () {
            this.typeSelected = null
            this.frameSelected = null
            this.clientSelected = null
            this.idTask = null
            this.nameTask = null
            this.typeSelected = null
            this.dateTask = ''
        },
        openDialog () {
            this.show = !this.show
            this.cleanDatas()
        },
        getDatas () {
            Get('v1/tipo').then(res => {
                this.typeOptions = res.data
            })
            Get('v1/quadro').then(res => {
                this.frameOptions = res.data
            })
            Get('v1/clientes').then(res => {
                this.clientOptions = res.data.sort(function (a, b) {
                    return a - b
                })
            })
        },
        getDataTask () {
            if (this.idTask === null || this.idTask === '' || this.idTask === undefined) {
                this.$q.notify({
                    message: 'Informe o ID da tarefa para prosseguir',
                    type: 'negative',
                    timeout: 2000
                })
            } else {
                Get('v1/runnittask/' + this.idTask).then(res => {
                    // console.log(res.data)
                    this.nameTask = res.data.title
                    var data = new Date(res.data.close_date).toLocaleDateString('pt-BR')
                    this.clientSelected = res.data.client_name
                    this.dateTask = data
                }).catch(err => {
                    this.$q.notify({
                        message: err.message,
                        type: 'negative',
                        timeout: 5000
                    })
                })
                
            }
        },
        filterClient (val, update) {
            if (val === '') {
                update(() => {
                    this.filterClientOptions = this.clientOptions
                })
                return
            }

            update(() => {
                const needle = val.toLowerCase()
                this.filterClientOptions = this.clientOptions.filter(f => f.name.trim().toLowerCase().indexOf(needle) > -1)
            })
        },
        verifyFields () {
            return new Promise(resolve => {
                var campoVazio = false

                if (this.idTask === '' || this.idTask === null) {
                    this.errorIdTask = true
                    campoVazio = true
                } else {
                    this.errorIdTask = false
                    campoVazio = false
                }

                if (this.nameTask === '' || this.nameTask === null || this.nameTask.length > 50) {
                    this.errorNameTask = true
                    campoVazio = true
                } else {
                    this.errorNameTask = false
                    campoVazio = false
                }

                if (this.dateTask === '' || this.dateTask === null) {
                    this.errorDateTask = true
                    campoVazio = true
                } else {
                    this.errorDateTask = false
                    campoVazio = false
                }

                if (this.clientSelected === '' || this.clientSelected === null) {
                    this.errorClientSelected = true
                    campoVazio = true
                } else {
                    this.errorClientSelected = false
                    campoVazio = false
                }

                if (this.typeSelected === '' || this.typeSelected === null) {
                    this.errorTypeSelected = true
                    campoVazio = true
                } else {
                    this.errorTypeSelected = false
                    campoVazio = false
                }

                if (this.frameSelected === '' || this.frameSelected === null) {
                    this.errorFrameSelected = true
                    campoVazio = true
                } else {
                    this.errorFrameSelected = false
                    campoVazio = false
                }

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
        confirm(title) {
            return new Promise((resolve) => {
                this.$q.dialog({
                    dark: true,
                    title: title,
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        },
        async addNewTask () {
            this.verifyFields().then(async () => {
                this.confirm('Deseja incluir a tarefa ?').then(async () => {
                    this.$q.notify({
                        message: 'Carregando...',
                        color: 'accent',
                        timeout: 1000
                    })

                    var task = Object()
                    task.nome = this.nameTask
                    task.data = await ConverteStringPraDatetime(this.dateTask)
                    task.quadroid = Number(this.frameSelected.id)
                    task.tipoid = Number(this.typeSelected.id)
                    if (this.clientSelected.name === undefined || this.clientSelected.name === null) {
                        task.cliente = this.clientSelected
                    } else {
                        task.cliente = this.clientSelected.name
                    }
                    task.tarefaid = this.idTask
                    console.log(task)

                    setTimeout(() => {
                        Post('v1/tarefa/novo', task).then(res => {
                            if (res.data.status == true) {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'green',
                                    timeout: 2000
                                })
                                this.$emit('updateTable')
                            }
                            else {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'red',
                                    timeout: 2000
                                })
                            }
                            this.openDialog()
                        }).catch(err => {
                            this.$q.notify({
                                message: 'Erro ao inserir tarefa',
                                color: 'red',
                                timeout: 2000
                            })
                            this.desabilitarBotao = false
                            console.log(err)
                        })
                    }, 1000);
                })
            })
        }
    },
    watch: {
        typeSelected: function (val) {
            if (val !== null) {
                this.idType = val.id
            }
        }
    },
    created () {
        this.getDatas()
    }
}
</script>

<style scoped>
    .dialog {
        height: 150px;
    }

    .inputs {
        padding: 3px;
    }
</style>