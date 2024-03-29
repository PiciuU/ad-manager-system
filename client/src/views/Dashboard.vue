<template>
    <el-main>
        <el-row class="cards__container" :gutter="32">
            <el-col :span="6" class="el-hidden-md-and-down">
                <el-card class="card card--has-hint">
                    <el-popover
                        placement="right-start"
                        :width="220"
                        trigger="hover"
                        content="Współczynnik CTR (klikalności) to odsetek wyświetleń reklamy, które doprowadziły do kliknięcia."
                    >
                        <template #reference>
                            <div class="card__hint"><font-awesome-icon icon="question" /></div>
                        </template>
                    </el-popover>

                    <div class="card__title">Współczynnik CTR (ostatni miesiąc)</div>
                    <div class="card__data-ctr" v-if="!adStore.isLoading">{{ data.ctr }}%</div>
                </el-card>
            </el-col>
            <el-col :span="24" :lg="18">
                <el-card class="card">
                    <div class="card__title">Statystyki</div>
                    <div class="card__body" v-if="!adStore.isLoading">
                        <div class="card__item" v-for="(item, index) in statisticsCards" :key="index">
                            <div class="card__data-circle" :style="{ 'background-color': `rgba(${item.color}, 0.1)` }">
                                <font-awesome-icon class="card__data-icon" :icon="item.icon" :style="{ color: `rgb(${item.color})` }"/>
                            </div>
                            <div class="card__details">
                                <div class="card__data-amount">{{ item.value }}</div>
                                <div class="card__data-description">{{ item.description }}</div>
                            </div>
                        </div>
                    </div>
                    <el-skeleton :rows="1" animated v-else />
                </el-card>
            </el-col>
        </el-row>

        <el-row class="cards__container" :gutter="32">
            <el-col :span="24" :lg="12">
                <el-card class="card cardstats">
                    <div class="card__title">Wszystkie wyświetlenia (ostatni rok)</div>
                    <line-chart
                        v-if="!adStore.isLoading && isRendered"
                        download="Wyswietlenia_podsumowanie"
                        empty="Brak danych"
                        :discrete="true"
                        :data="data.views"
                    ></line-chart>
                    <el-skeleton class="card__skeleton" :rows="5" animated v-else />
                </el-card>
            </el-col>
            <el-col :span="24" :lg="12">
                <el-card class="card">
                    <div class="card__title">Wszystkie kliknięcia (ostatni rok)</div>
                    <line-chart
                        v-if="!adStore.isLoading && isRendered"
                        download="Klikniecia_podsumowanie"
                        empty="Brak danych"
                        :discrete="true"
                        :data="data.clicks"
                    ></line-chart>
                    <el-skeleton class="card__skeleton" :rows="5" animated v-else />
                </el-card>
            </el-col>
        </el-row>
    </el-main>
</template>

<script setup>
    import { ref, reactive, onMounted, onActivated, onDeactivated } from 'vue';
    import { useAdStore } from '@/stores/AdStore';

    const adStore = useAdStore();

    const isRendered = ref('');

    onActivated(() => {
		isRendered.value = true;
	})

	onDeactivated(() => {
		isRendered.value = false;
	})

    const data = reactive({
        summary: {},
        views: {},
        clicks: {},
        ctr: '0.00'
    })

    onMounted(() => {
        adStore.getSummary()
            .then((response) => {
                Object.assign(data, response.data);
                statisticsCards.forEach((statistic) => {
                    statistic.value = data.summary[statistic.name]
                })
            })
    });

    const statisticsCards = reactive([
        {
            description: 'Wszystkie reklamy',
            icon: 'chart-line',
            color: '0, 120, 200',
            name: 'num_of_all_ads',
            value: 0
        },
        {
            description: 'Aktywne reklamy',
            icon: 'chart-area',
            color: '0, 120, 200',
            name: 'num_of_active_ads',
            value: 0
        },
        {
            description: 'Wyświetlenia (dzisiaj)',
            icon: 'eye',
            color: '0, 120, 200',
            name: 'num_of_today_views',
            value: 0
        },
        {
            description: 'Kliknięcia (dzisiaj)',
            icon: 'mouse',
            color: '0, 120, 200',
            name: 'num_of_today_clicks',
            value: 0
        }
    ]);
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 1000px) {
        .card {
            &__body {
                grid-template-columns: auto auto;
            }

            &__item {
                &:nth-child(-n + 2) {
                    margin-bottom: 20px;
                }
            }
        }
    }

    @media screen and (max-width: $--breakpoint-small-devices) {
        .card {
            &__body {
                grid-template-columns: auto;
            }

            &__item {
                margin-bottom: 20px;
            }
        }
    }

    @media screen and (max-width: $--breakpoint-mobile) {
        .cards__container {
            padding: 0px;
        }
    }
</style>
