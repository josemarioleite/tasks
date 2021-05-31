<template>
  <div class="q-pa-xs">
    <div class="row q-mb-sm col-12">
        <div class="col-xs-6 col-md-2" style="padding: 2px">
            <q-select filled dense v-model="optionTypeSelected" label-color="dark"
                :options="optionsType" option-value="id" option-label="nome" label="Tipo"
                counter max-values="1" hint="Máx: 1"
            />
        </div>
        <div class="col-xs-6 col-md-2" style="padding: 2px">
            <q-select filled dense v-model="optionFrameSelected" label-color="dark"
                :options="optionsFrame" option-value="id" option-label="nome" label="Quadro"
                counter max-values="1" hint="Máx: 1"
            />
        </div>
    </div>
    <q-table
        dense
        bordered
        title="Tarefas"
        row-key="id"
        separator="cell"
        @request="onRequest"
        virtual-scroll
        :loading="isLoading"
        :filter="filter"
        :pagination.sync="pagination"
        :data="data"
        :columns="columns"
    >
        <template v-slot:top-right>
            <div class="col-12 column">
                <div class="row">
                    <q-btn icon="event" round color="primary" class="q-mr-md">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-date @click="loaderItems" v-model="date" range />
                        </q-popup-proxy>
                    </q-btn>
                    <div>
                        <q-input dense v-model="filter" placeholder=" Buscar" bg-color="transparent" debounce="750">
                        <template v-slot:prepend>
                            <q-icon class="q-ml-sm" name="search" size="20px" />
                        </template>
                        <template v-slot:append>
                            <q-btn @click="loaderItensAndCleanDates" icon="close" round size="10px" class="q-mr-md text-red">
                                <q-tooltip content-class="bg-indigo" :offset="[10, 10]">Limpar Dados</q-tooltip>
                            </q-btn>
                        </template>
                        </q-input>
                    </div>
                </div>
                <div v-show="date.to !== undefined" class="q-mt-xs flex flex-center">Período Escolhido: {{new Date(date.from).toLocaleDateString('pt-BR')}} à {{new Date(date.to).toLocaleDateString('pt-BR')}}</div>
            </div>
        </template>
        <template v-slot:body-cell-tarefaid="props">
            <q-td :props="props">
                <a :href="linkRunnit.concat(props.row.tarefaid)" target="_blank">#{{props.row.tarefaid}}</a>
            </q-td>
        </template>
        <template v-slot:body-cell-urgente="props">
            <q-td :props="props">
                <div v-if="props.row.urgente == 'N'">
                    <q-btn icon="iens" round dense color="green" :props="props" size="9px" class="q-mr-sm" />
                </div>
                <div v-if="props.row.urgente == 'S'">
                    <q-btn icon="iens" round dense color="red" :props="props" size="9px" class="q-mr-sm" />
                </div>
            </q-td>
        </template>
    </q-table>
    <div class="row col-12 q-mt-md">
        <div class="col-xs-12 col-md-4">
            <q-table
                row-key="id"
                separator="cell"
                bordered
                virtual-scroll
                dense
                title="Cliente"
                :filter="filterClient"
                :rows-per-page-options="limitRows"
                :columns="columnsCount"
                :data="clients"
            >
                <template v-slot:top-right>
                    <q-input dense v-model="filterClient" placeholder=" Buscar" bg-color="transparent" debounce="750" />
                </template>
            </q-table>
        </div>
        <div class="col-xs-12 col-md-4">
            <q-table
                row-key="id"
                separator="cell"
                bordered
                virtual-scroll
                dense
                title="Quadro"
                :filter="filterFrame"
                :rows-per-page-options="limitRows"
                :columns="columnsCount"
                :data="frames"
            >
                <template v-slot:top-right>
                    <q-input dense v-model="filterFrame" placeholder=" Buscar" bg-color="transparent" debounce="750" />
                </template>
            </q-table>
        </div>
        <div class="col-xs-12 col-md-4">
            <q-table
                row-key="id"
                separator="cell"
                bordered
                virtual-scroll
                dense
                title="Tipo"
                :filter="filterType"
                :rows-per-page-options="limitRows"
                :columns="columnsCount"
                :data="types"
            >
                <template v-slot:top-right>
                    <q-input dense v-model="filterType" placeholder=" Buscar" bg-color="transparent" debounce="750" />
                </template>
            </q-table>
        </div>
    </div>
    <div class="row q-mt-md q-mb-md">
        <q-card class="row items-center">
            <q-card-section class="text-center">Total de Tarefas:</q-card-section>
            <q-separator />
            <q-card-section class="row flex flex-center">
                <div class="text-h4">{{rowCount}}</div>
                <div class="q-ml-sm q-mr-sm text-h5"> de </div>
                <div class="text-h4">{{totalRowCount}}</div>
            </q-card-section>
        </q-card>
    </div>
  </div>
</template>

<script>
import { Get } from 'src/utils/Conexao.js'
import { VerifyLogin } from 'src/utils/VerificaLogin.js'

export default {
    name: 'Tarefas',
    data () {
        return {
            linkRunnit: 'https://runrun.it/pt-BR/tasks/',
            filterClient: '',
            filterType: '',
            filterFrame: '',
            limitRows: [3],
            rowCount: 0,
            totalRowCount: 0,
            filter: undefined,
            isLoading: false,
            optionTypeSelected: null,
            optionsType: [],
            optionFrameSelected: null,
            optionsFrame: [],
            data: [],
            clients: [],
            frames: [],
            types: [],
            columnsCount: [
                { name: 'id', headerClasses: 'bg-dark text-white', required: true, label: 'ID', align: 'right', field: 'id', style: 'width: 5px'},
                { name: 'nome', headerClasses: 'bg-dark text-white', required: true, label: 'Nome', align: 'left', field: 'nome', style: 'width: 5px'},
                { name: 'quantidade', headerClasses: 'bg-dark text-white', required: true, label: 'Quantidade', align: 'right', field: 'quantidade', style: 'width: 5px'},
            ],
            columns: [
                { name: 'id', headerClasses: 'bg-dark text-white', required: true, label: 'ID', align: 'right', field: 'id', style: 'width: 5px'},
                { name: 'urgente', headerClasses: 'bg-dark text-white', required: true, label: 'Urgente', align: 'center', style: 'width: 5px'},
                { name: 'tarefaid', headerClasses: 'bg-dark text-white', required: true, label: 'Tarefa', align: 'center', style: 'width: 20px'},
                { name: 'nome', headerClasses: 'bg-dark text-white', required: true, label: 'Nome', align: 'left', field: 'nome', style: 'width: 100px'},
                { name: 'cliente', headerClasses: 'bg-dark text-white', required: true, label: 'Cliente', align: 'left', field: 'cliente', style: 'width: 150px'},
                { name: 'data', headerClasses: 'bg-dark text-white', required: true, label: 'Data', align: 'center', field: row => new Date(row.data).toLocaleDateString('pt-BR'), style: 'width: 50px'},
                { name: 'quadro', headerClasses: 'bg-dark text-white', required: true, label: 'Quadro', align: 'left', field: row => row.quadro.nome, style: 'width: 50px'},
                { name: 'tipo', headerClasses: 'bg-dark text-white', required: true, label: 'Tipo', align: 'left', field: row => row.tipo.nome, style: 'width: 100px'}
            ],
            datas: [],
            date: {
                from: undefined,
                to: undefined
            },
            pagination: {
                sortBy: 'desc',
                descending: false,
                page: 1,
                rowsPerPage: 7,
                rowsNumber: 7
            },
        }
    },
    watch: {
        optionTypeSelected: function (val) {
            if (this.optionTypeSelected !== null) {
                if (val.nome !== null) {
                    this.filter = val.nome//convertToSlug(val.nome)
                    this.loaderItems()
                }
            }
        },
        optionFrameSelected: function (val) {
            if (this.optionFrameSelected !== null) {
                if (val.nome !== null) {
                    this.filter = val.nome//convertToSlug(val.nome)
                    this.loaderItems()
                }
            }
        }
    },
    methods: {
        getTypes () {
            Get('v1/tipo').then(res => {
                this.optionsType = res.data
            })
            Get('v1/quadro').then(res => {
                this.optionsFrame = res.data
            })
            Get('v1/geral/tipo').then(res => {
                this.types = res.data
            })
            Get('v1/geral/quadro').then(res => {
                this.frames = res.data
            })
            Get('v1/geral/cliente').then(res => {
                this.clients = res.data
            })
        },
        async onRequest (props) {
            this.isLoading = true

            const {page, rowsPerPage } = props.pagination
            const filter = props.filter
            const dateFrom = this.date.from
            const dateTo = this.date.to

            Get(`v1/tarefa/?filter=${filter}&onlyRowCount=true`).then(result => {
                this.pagination.rowsNumber = result.data.rowCount
                this.totalRowCount = result.data.rowCount
            })

            var returnedData = []

            const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage
            
            if (dateFrom !== undefined && dateTo !== undefined) {
                returnedData = await Get(`v1/tarefa/?countRows=true&filter=${filter}&pageIndex=${page}&pageSize=${fetchCount}&startDate=${dateFrom}&finalDate=${dateTo}`)                
            } else {
                returnedData = await Get(`v1/tarefa/?countRows=true&filter=${filter}&pageIndex=${page}&pageSize=${fetchCount}`)
            }

            this.data.splice(0, this.data.length, ...returnedData.data.tarefa)
            this.rowCount = returnedData.data.rowCount
            this.pagination.page = page
            this.pagination.rowsPerPage = rowsPerPage
            this.datas = this.data  
            
            this.isLoading = false
        },
        async loaderItems () {
            if (this.filter === undefined) {
                await this.onRequest({
                    pagination: this.pagination,
                    filter: undefined
                })
            } else {
                await this.onRequest({
                    pagination: this.pagination
                })
            }
        },
        dateCurrent () {
            var date = new Date().toDateString()
            if (date !== undefined) {
                this.date = date
            }
        },
        loaderItensAndCleanDates () {
            this.filter = undefined
            this.optionTypeSelected = null
            this.optionFrameSelected = null
            const date = {
                from: undefined,
                to: undefined
            }
            this.date = date
            this.loaderItems()
        }
    },
    created () {
        VerifyLogin()
        this.loaderItems()
        this.dateCurrent()
        this.getTypes()
    }
}
</script>
