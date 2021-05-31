<template>
    <q-layout>
        <q-header elevated class="bg-black">
            <q-toolbar>
                <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
            </q-toolbar>
        </q-header>
        <q-drawer
            v-model="drawer"
            content-class="bg-dark text-white"
            show-if-above
            :width="250"
            :breakpoint="400"
        >
            <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 152px">
                <div class="absolute-bottom bg-transparent">
                    <q-avatar size="80px" class="q-mb-xs bg-black text-white">
                        <div v-if="imageUser === ''">{{nameUser.substr(0,1)}}</div>
                        <img v-else :src="imageUser">
                    </q-avatar>
                    <div class="text-weight-bold text-white">{{nameUser}}</div>
                    <div class="text-white">@{{loginUser}}</div>
                </div>
            </q-img>

            <q-scroll-area dark style="height: calc(100% - 152px); margin-top: 152px; border-right: 1px solid transparent">
                <q-list>
                    <q-item clickable v-ripple @click="exitToApp">
                        <div class="row items-center">
                            <q-item-section avatar>
                                <div class="row items-center col-12">
                                    <q-icon color="white" name="exit_to_app" size="28px"/>
                                    <div style="font-size: 16px; margin-left: 20px">Sair</div>
                                </div>
                            </q-item-section>                            
                        </div>
                    </q-item>
                </q-list>
            </q-scroll-area>
        </q-drawer>
    </q-layout>
</template>

<script>
import { Get } from 'src/utils/Conexao.js'

export default {
    name: 'Header',
    data () {
        return {
            imageUser: '',
            nameUser: '',
            loginUser: '',
            useridrunnit: '',
            imageUserRunnit: '',
            drawer: false
        }
    },
    methods: {
        getDataUser () {
            Get('v1/usuario').then(res => {
                this.nameUser = res.data[0].nome
                this.loginUser = res.data[0].login
                this.useridrunnit = res.data[0].usuarioidrunnit
            }).catch(err =>{
                console.log(err)
            })
        },
        exitToApp () {
            sessionStorage.clear()
            location.reload()
        }
    },
    created () {
        this.getDataUser()
    }
}
</script>