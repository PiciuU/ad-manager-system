import { defineStore } from 'pinia';
import { router } from '@/router/index';

import ApiService from '@/services/api.service';
import NotificationService from '@/services/notification.service';
import { setCookie, getCookie, deleteCookie } from '@/services/storage.service';

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        token: getCookie('token') || null,
        user: {},
        loading: false,
    }),
    getters: {
        getUser: (state) => state.user,
        isLoading: (state) => state.loading,
        isLogged: (state) => !!state.token,
        isAdmin: (state) => Object.keys(state.user).length != 0 && state.user?.userRole === 'Admin',
        isAuthenticated: (state) => !!state.token && Object.keys(state.user).length != 0 && state.user.constructor === Object,
    },
    actions: {
        /* Authorization */
        async register(credentials) {
            try {
                this.loading = true;
                const response = await ApiService.put('/auth/activate', credentials);
                if (response.data) {
                    this.setAuthorization(response.data.token, response.data.user, false);
                }
            }
            catch (error) {
                NotificationService.displayError();
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        async validateActivationKey(activationKey) {
            try {
                this.loading = true;
                const response = await ApiService.put('/auth/validate/key', { activationKey });
                return Promise.resolve(response);
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        async validateActivationLogin(activationKey, login) {
            try {
                this.loading = true;
                const response = await ApiService.put('/auth/validate/login', { activationKey, login });
                return Promise.resolve(response);
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        async validateActivationEmail(activationKey, email) {
            try {
                this.loading = true;
                const response = await ApiService.put('/auth/validate/email', { activationKey, email });
                return Promise.resolve(response);
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        async login(credentials) {
            try {
                this.loading = true;
                const response = await ApiService.post('/auth/login', credentials);
                this.setAuthorization(response.data.token, response.data.user);
            }
            catch (error) {
                if (error.status === 403) NotificationService.displayError('Twoje konto zostało zablokowane', `Powód blokady: ${error.data.data}`, 10000);
                else NotificationService.displayError('Nie udało się zalogować', 'Wprowadzono błędny login lub hasło.');
            } finally {
                this.loading = false;
            }
        },
        async logout() {
            try {
                this.loading = true;
                await ApiService.get('/auth/logout');
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
                this.clearAuthorization();
            }
        },
        async forceLogout() {
            try {
                this.loading = true;
                await ApiService.get('/auth/logout/all');
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
                this.clearAuthorization();
            }
        },
        async passwordRecover(credentials) {
            try {
                this.loading = true;
                const response = await ApiService.post('/auth/recover', credentials);
                return Promise.resolve(response);
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        async validatePasswordResetHash(hash) {
            try {
                this.loading = true;
                const response = await ApiService.get('/auth/recover', hash);
                return Promise.resolve(response);
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        async passwordReset(credentials) {
            try {
                this.loading = true;
                const response = await ApiService.post('/auth/reset', credentials);
                return Promise.resolve(response);
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        /* User data */
        async fetchUser() {
            try {
                this.loading = true;
                const response = await ApiService.get('auth/user');
                this.user = response.data;
            } catch (error) {
               this.clearAuthorization();
            } finally {
                this.loading = false;
            }
        },
        async updateData(payload) {
            try {
                this.loading = true;
                const response = await ApiService.put('/auth/user', payload);
                this.user = response.data
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        async changeMail(payload) {
            try {
                this.loading = true;
                const response = await ApiService.put('/auth/user/mail', payload);
                this.user.email = response.data.email;
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        async changePassword(payload) {
            try {
                this.loading = true;
                await ApiService.put('/auth/user/password', payload);
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        /* User Notifications */
        async fetchLatestNotifications() {
            try {
                this.loading = true;
                const response = await ApiService.get('notifications/latest');
                return Promise.resolve(response);
            } catch (error) {
                return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        async fetchNotifications(page = 1) {
            try {
                this.loading = true;
                const response = await ApiService.get(`notifications?page=${page}`);
                return Promise.resolve(response);
            } catch (error) {
               return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        async changeNotificationStatus(id) {
            try {
                this.loading = true;
                const response = await ApiService.get(`notifications/${id}/seen`);
                return Promise.resolve(response);
            } catch (error) {
               return Promise.reject(error.data);
            } finally {
                this.loading = false;
            }
        },
        /* Synchronous Methods */
        setAuthorization(token, user, redirect = true) {
            this.user = user;
            this.token = token;
            setCookie('token', token);
            if (redirect) router.push({ name: 'Home' });
        },
        clearAuthorization() {
            this.user = {};
            this.token = null;
            deleteCookie('token');
            router.push({ name: 'Login' });
        },
    }
});