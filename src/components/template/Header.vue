<template>
    <q-layout>
        <q-header elevated class="bg-black">
            <q-toolbar>
                <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
                <!-- <q-toolbar-title></q-toolbar-title> -->
            </q-toolbar>
        </q-header>
        <!-- <q-drawer
            show-if-above
            :width="250"
            :breakpoint="700"
            elevated
            content-class="bg-grey-7 text-white"
        >
            <q-scroll-area class="fit">
                <div class="q-pa-sm">
                    <div v-for="n in 10" :key="n">Drawer {{ n }} / 10</div>
                </div>
            </q-scroll-area>
        </q-drawer> -->
    </q-layout>
</template>

<script>
export default {
    name: 'Header',
    data () {
        return {
            drawer: false
        }
    }
}
</script>