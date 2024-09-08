<script setup lang="ts">
import type { ResponseWithValue } from '~/interfaces/response/response.interface';
import type { TicketMessage, Ticket } from '~/interfaces/tickets/tickets.interface';

import { brand } from '~/core/manager/AssetsManager';
import RoutesManager from '~/core/manager/RoutesManager';

const authStore = useAuthStore();
const localPath = useLocalePath();
const {t} = useI18n();
interface CustomMessages {
    type: string;
    messages: TicketMessage[]
}
const route = useRoute();
const ticketItem = ref<Ticket | null>()
const messages = ref<CustomMessages[]>([])
let intervalId: NodeJS.Timeout;
const messageInput = ref(null)
const messageData = ref<string | null>(null)
const isLoading = ref(false);
const ticketTypes: {[key: string]: string} = {
    technical_support: t('support'),
    customer_service: t('customer_service'),
    complaints: t('complaints'),
}

const fetchTicketItem = () => {
    useAppFetch<ResponseWithValue<Ticket>>().eventGetUserTicketItem(route.params.id.toString()).then((response) => {
        ticketItem.value = response.data

        let ar: TicketMessage[] = []
        let type = '';
        let currentIndex = -1;

        ticketItem.value.messages.forEach((item, index) => {

            if (item.owner === 'admin') {
                if (type != 'admin') {
                    currentIndex++
                    ar = [];
                }
                type = 'admin'
            } else {
                if (type != 'user') {
                    currentIndex++
                    ar = [];
                }
                type = 'user'
            }
            ar.push(item)

            messages.value[currentIndex] = {
                type: type,
                messages: [...ar],
            }

        })
        messages.value = [...messages.value.reverse()]
    })
}

const send = async () => {
    //@ts-ignore
    // await messageInput.value.validate()

    const fd = new FormData();
    if (!messageData.value) return

    console.log('valid')


    fd.append('message', messageData.value.toString())
    fd.append('ticket_id', route.params.id.toString())
    isLoading.value = true;
    useAppFetch<ResponseWithValue<TicketMessage>>().eventAddMessage(fd).then((response) => {
        // notifyAlert('success', response.meta.message)
        isLoading.value = false;

        messageData.value = null;
        fetchTicketItem()
    }).catch((error) => {
        SET_ERROR(error)
    }).finally(() => {
        isLoading.value = false
    })
}


onMounted(() => {
    fetchTicketItem()

    intervalId = setInterval(() => {
        fetchTicketItem();
    }, 30000)
})
onUnmounted(() => {
    clearInterval(intervalId)
})
const validationRules = {
    required: (v: any) => !!v || 'required'
}
</script>
<template>
    <v-sheet width="100%" class="py-16" color="transparent">
        <v-container>
            <div class="routes font-weight-bold mt-5 mb-15 d-flex align-center ga-1">
                <NuxtLink class="text-brand-color-text-default" :to="localPath(RoutesManager.tickets)">
                     {{ $t('support') }}
                </NuxtLink>
                <v-icon :icon="$vuetify.locale.isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"></v-icon>
                <p class="text-primary">{{ ticketItem?.title }}  </p>
            </div>
            <v-card color="" variant="outlined" class="ticket-datails-card" rounded="lg">
                <!-- <div
                    class="card-title font-weight-bold text-center text-h6 text-md-h5 d-flex align-center justify-center">
                    {{ ticketItem?.title }}
                </div> -->
                <!-- <v-divider></v-divider> -->

                <v-expansion-panels class="d-block d-md-none  my-5 px-3 " elevation="0">
                    <v-expansion-panel :title="$t('desc_ticket')" class="expansion-details font-weight-bold" rounded="lg"
                        height="">
                        <v-expansion-panel-text>
                            <p class="mb-4 font-weight-medium bg-secondary pa-3 rounded-lg text-center">{{
                                ticketItem?.id }}
                            </p>
                            <p  class="mb-4 font-weight-medium bg-secondary pa-3 rounded text-center">{{
                                ticketItem ? ticketTypes[ticketItem.type] : ''
                            }}
                            
                            </p>
                            <p class=" mb-4 font-weight-medium bg-secondary pa-3 rounded text-center">{{
                                ticketItem?.status
                            }}
                            </p>
                            <p class="mb-4 font-weight-medium bg-secondary pa-3 rounded text-center ">{{
                                ticketItem?.body }}
                            </p>
                        </v-expansion-panel-text>

                    </v-expansion-panel>
                </v-expansion-panels>

                <v-divider class="d-block d-md-none"></v-divider>
                <div class="wrap d-flex" :class="$vuetify.display.mobile ? 'wrap-mobile' : 'wrap'">
                    <div class="d-md-flex flex-column ga-7 d-none  ticket-wrap pa-10  ">
                        <p class="font-weight-medium bg-secondary pa-3 rounded-lg text-center">{{ ticketItem?.id }}
                        </p>
                        <p class="font-weight-medium bg-secondary pa-3 rounded text-center">{{ ticketItem ? ticketTypes[ticketItem.type] : '' }}
                        </p>
                        <p class="font-weight-medium bg-secondary pa-3 rounded text-center">{{ ticketItem?.status
                            }}
                        </p>
                        <p class="font-weight-medium bg-secondary pa-3 rounded text-center ">{{ ticketItem?.body }}
                        </p>
                    </div>
                    <v-divider class="d-none d-block" vertical></v-divider>
                    <div class="messages-wrap">
                        <div class="msgs pa-8 ">
                            <template v-for="(item, index) in messages">
                                <div v-if="item.type === 'admin'" class="w-100  d-flex ga-3 mb-5">
                                    <v-avatar>
                                        <v-img :lazy-src="brand.avatar" :src="brand.avatar"></v-img>
                                    </v-avatar>
                                    <div>
                                        <p class="text-msg bg-grey-lighten-2  text-brand-color-text-default font-weight-medium rounded-lg px-3 d-flex align-center mb-3"
                                            v-for="mesg in item.messages">{{ mesg.message }}</p>
                                    </div>
                                </div>
                                <div class="d-flex ga-3 flex-row-reverse mb-5" v-else>
                                    <v-avatar>
                                        <v-img :lazy-src="brand.avatar"
                                            :src="authStore.user?.avatar_path || ''"></v-img>
                                    </v-avatar>
                                    <div>
                                        <p class="text-msg bg-primary text-white font-weight-medium rounded-lg px-3 d-flex  align-center mb-3"
                                            v-for="mesg in item.messages">{{ mesg.message }}</p>
                                    </div>
                                </div>
                            </template>


                        </div>
                        <v-divider></v-divider>
                        <div class="text-input d-flex align-end justify-center px-5">
                            <v-text-field :disabled="ticketItem?.check_status=='closed' " ref="messageInput" v-model="messageData" variant="solo-filled" color="primary"
                                :placeholder="$t('type_message')">
                                <template v-slot:append-inner>
                                    <v-btn @click="send" size="x-small" :loading="isLoading" class="" variant="plain"
                                        icon :ripple="isLoading">
                                        <v-icon :class="{'rotation':$vuetify.locale.isRtl}" color="primary">mdi mdi-send</v-icon>
                                    </v-btn>
                                </template>
                            </v-text-field>

                        </div>
                    </div>

                </div>
            </v-card>







        </v-container>
    </v-sheet>
</template>


<style scoped lang="scss">
.rotation{
    transform: rotate(180deg) !important;
}
.ticket-datails-card {
    height: auto;
    border: 1px solid rgb(var(--v-theme-secondary)) !important;
    
    @include media-breakpoint-up(md) {
        height: 80vh;
    }
    
    .card-title {
        height: 70px;
    }
    
    .expansion-details {
        border: 1px solid rgb(var(--v-theme-secondary)) !important;
    }


    .wrap {
        width: 100%;
        height: 100%;
        /* height: calc(100% - 71px); */

        .ticket-wrap {
            width: 375px;
            height: 100%;
            overflow: auto;
        }

        .messages-wrap {
            width: 100%;
            height: 600px;
            display: flex;
            flex-direction: column;

            @include media-breakpoint-up(lg) {
                width: calc(100% - 375px);
                height: 100%;
            }

            .msgs {
                height: calc(100% - 100px);
                overflow-y: auto;
                display: flex;
                flex-direction: column-reverse;

            }

            .msgs::-webkit-scrollbar {
                width: 10px;
            }

            .msgs::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;


            }

            .msgs::-webkit-scrollbar-thumb {
                background: #FFB200;
                border-radius: 10px;


            }

            .text-input {
                height: 100px;

            }


        }
        
    }


    .text-msg {
        height: 40px;

    }
}
</style>