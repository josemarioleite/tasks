<template>
    <div class="q-pa-sm container row justify-center items-center col-12">
        <div class="frame">
            <div class="text-h5 text-center col-12">Tarefas</div>
            <div class="text-center col-12">Data: {{date}}</div>
            <hr class="bg-dark">
            <div class="q-pa-xs row justify-center">
                <q-input :error="errorLoginUser" class="q-pl-xs q-pr-xs col-12" outlined v-model="loginUser" label="Login" />
                <q-input :error="errorPasswordUser" class="col-12 q-pl-xs q-pr-xs q-mt-xs" outlined v-model="passwordUser" label="Senha" />
            </div>
            <div class="col-12 row justify-center q-mt-xs">
                <q-btn @click="login" label="Entrar" color="black" />
            </div>
        </div>
        <NewPassword ref="newPassword" />
    </div>
</template>

<script>
import { Post } from 'src/utils/Conexao.js'
import { DecodeJWT } from 'src/utils/JwtUtils.js'
import NewPassword from 'src/components/dialogs/NewPassword.vue'

export default {
    name: 'Login',
    components: {NewPassword},
    data () {
        return {
            loginUser: null,
            errorLoginUser: false,
            passwordUser: null,
            errorPasswordUser: false,
            date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
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
        verifiyFields () {
            return new Promise(resolve => {
                var campoVazio = false

                if (this.loginUser === null || this.loginUser === undefined || this.loginUser === '') {
                    this.errorLoginUser = true
                    campoVazio = true
                } else {
                    this.errorLoginUser = false
                    campoVazio = false
                }

                if (this.passwordUser === null || this.passwordUser === undefined || this.passwordUser === '') {
                    this.errorPasswordUser = true
                    campoVazio = true
                } else {
                    this.errorPasswordUser = false
                    campoVazio = false
                }

                if (campoVazio === false) {
                    resolve(true)
                } else {
                    this.message('Preencha todos os campos obrigatórios', 'red')
                }
            })
        },
        login () {
            this.verifiyFields().then(() => {
                var auth = Object()
                auth.login = this.loginUser.trim()
                auth.senha = this.passwordUser.trim()
                
                this.message('Carregando...', 'primary')
                setTimeout(() => {
                    Post('v1/usuario/auth/login', auth).then(async (res) => {
                        if (res.data.status === true) {
                            var token = await DecodeJWT(res.data.token)
                            var json = JSON.parse(token)
                            localStorage.setItem('token', res.data.token)
                            if (json.primeiroacesso === 'S') {
                                this.$refs.newPassword.openDialog()
                            } else {
                                this.message('Autenticação feita com sucesso!', 'green')
                                this.$router.push('/home')
                            }
                        } else {
                            this.message(res.data.msg, 'red')
                            this.passwordUser = null
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }, 1000);
            })
        }
    }
}
</script>

<style>
    .container {
        width: 100%;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .frame {
        width: 50%;
        height: 45vh;
        border: 1px solid #000;
        border-radius: 5px;
    }

    @media only screen and (max-width: 499px) {
        .frame {
            width: 90%;
        }
    }
</style>