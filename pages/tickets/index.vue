<template>
    <v-sheet color="transparent" width="100%" min-height="100vh" class="py-16">
        <v-container>
            <h4 class="text-primary mb-16">{{ $t('support') }}</h4>

            <v-row>
                <v-col cols="12" md="4" sm="6">
                    <v-card theme="light" elevation="0" @click="goTo(RoutesManager.addTicket)" min-height="140" height="100%"
                        rounded="lg" color="primary" class="d-flex flex-column align-center justify-center">
                        <v-icon size="35" color="white">mdi-file-plus</v-icon>
                        <p class="text-white">{{ $t('add_support') }}</p>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4" sm="6" v-for="(item, index) in tickets">
                    <v-card @click.self="openTicketDetails(item.id)"
                        rounded="lg" variant="outlined" color="primary" class="pa-1">

                        <div class="font-weight-medium text-brand-color-text-default text-start pa-2 ">
                            <div class=" d-flex align-center justify-space-between ">
                                <p @click="openTicketDetails(item.id)" class="">{{ $t('ticket_number') }}: {{ item.id }}</p>
                                <BaseConfirmActionDialog @confirm="deleteTicket(item.id.toString(), index)"
                                    v-model="dialog[index]" :dialog="dialog[index]" :loading="loading">
                                    <template v-slot="activatorProps">
                                        <v-icon v-bind="activatorProps" class="cursor-pointer" color="primary"
                                            size="25">
                                            mdi-trash-can-outline</v-icon>
                                    </template>
                                </BaseConfirmActionDialog>
                            </div>


                            <div @click="openTicketDetails(item.id)">
                                <p class="font-weight-bold truncate pe-7">{{ item.title }}</p>
                                <p class="truncate pe-7">{{ item.body }}</p>
                                <div class="d-flex align-center justify-space-between">
                                    <p class="text-green text-end my-4 ">{{ $t('status_ticket') }} {{ item.status }}</p>
                                    <div class="d-flex ga-2 align-center">
                                        <span v-if="!!item.messages.length">{{ item.messages.length }}</span>
                                        <v-icon v-if="!!item.messages.length" size="22"
                                            color="grey">mdi-message-text</v-icon>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </v-card>
                </v-col>
                <v-col v-if="loading" cols="12" md="4" sm="6" v-for="index in 10">
                    <v-card elevation="0" variant="outlined" color="primary" height="130">
                        <v-skeleton-loader class="mx-auto border" type="image"></v-skeleton-loader>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script setup lang="ts">
import RoutesManager from '~/core/manager/RoutesManager';
import type { ResponseData, ResponseWithValue } from '~/interfaces/response/response.interface';
import type { Ticket } from '~/interfaces/tickets/tickets.interface';
const tickets = ref<Ticket[]>([])



const loading = ref(true);
const route = useRoute()
const dialog = ref<boolean[]>([])

const fetchTickets = () => {
    loading.value = true
    useAppFetch<ResponseData<Ticket>>().eventGetUserTickets().then((response) => {
        tickets.value = response.data
        response.data.forEach((ticketItem,index) => {
           dialog.value.push(false) 

        })
        loading.value = false
    }).
        finally(() => {
            loading.value = false
        })
}
definePageMeta({ middleware: 'auth' })


const deleteTicket = (id: string, index: number) => {
    useAppFetch<ResponseWithValue<Ticket>>().eventDeleteUserTicket(id).then((response) => {
        console.log(response)
        notifyAlert('success', response.meta.message)
        tickets.value.splice(index, 1)
         dialog.value[index]=false



    })

}

const openTicketDetails = (id: number) => {
    goTo(RoutesManager.ticketDetails.replace('__ticket_id__', id.toString()))
}



onMounted(() => {
    fetchTickets()
})






</script>

<style scoped></style>