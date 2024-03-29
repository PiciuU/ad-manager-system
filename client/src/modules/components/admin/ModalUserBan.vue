<template>
    <el-dialog :model-value="true" title="Blokada użytkownika" :lock-scroll="true" :before-close="closeModal" :close-on-click-modal="!isLoading" :close-on-press-escape="!isLoading">
        <el-form v-if="user.isBanned == false" ref="form" label-position="top" :hide-required-asterisk="true" :model="formData" :rules="validationRules" @submit.prevent="validateData">
            <el-form-item prop="banReason" label="Powód blokady">
                <el-input v-model="formData.banReason" maxlength="255" placeholder="Wprowadź powód blokady konta..."></el-input>
            </el-form-item>
        </el-form>
        <div v-else>
            <div class="modal__label">Użytkownik został zbanowany z powodem:</div>
            <p>{{ user.banReason }}</p>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeModal" :loading="isLoading">Anuluj zmiany</el-button>
                <el-button v-if="user.isBanned == false" type="primary" @click="validateData" :loading="isLoading">Zablokuj użytkownika</el-button>
                <el-button v-else type="primary" @click="submitForm" :loading="isLoading">Odblokuj użytkownika</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { useAdminStore } from '@/stores/AdminStore';
    import NotificationService from '@/services/notification.service'

    const adminStore = useAdminStore();

    const props = defineProps({
        user: { type: Object, required: true, default: {} }
    });

    const emit = defineEmits(['close', 'update']);

    const isLoading = ref(false);

    const form = ref()

    const formData = reactive({
        banReason: ''
    })

    const validationRules = {
        banReason: [
            {
                required: true,
                message: 'Powód blokady nie może być pusty',
                trigger: 'blur'
            },
            {
                max: 255,
                message: 'Powód blokady może posiadać maksymalnie 255 znaków',
                trigger: 'blur'
            }
        ],
    }

    const closeModal = () => {
        if (!isLoading.value) emit('close');
    }

    const validateData = () => {
        form.value.validate((valid) => {
            if (!valid) return;
            submitForm();
        });
    }

    const submitForm = () => {
        isLoading.value = true;
        adminStore.banUser({ id: props.user.id, banReason: formData.banReason })
            .then((response) => {
                emit('update', response.data);
                emit('close');
                NotificationService.displayMessage('success', 'Pomyślnie zablokowano użytkownika.');
            })
            .catch(() => {
                NotificationService.displayMessage('error', 'Wystąpił nieoczekiwany błąd przy blokowaniu użytkownika, spróbuj ponownie później.');
            })
            .finally(() => {
                isLoading.value = false;
            })
    };
</script>

<style lang="scss" scoped>
    .modal__label {
        font-weight: bold;
        font-size: 1.6rem;
        margin-bottom: 5px;
    }
</style>
