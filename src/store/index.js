import Vue from 'vue'
import Vuex from 'vuex'
import { GET_PRODUCTS, DELETE_PRODUCTS, SET_PAGE_NUMBER, SET_PRODUCTS_TOTAL_VISIBLE, SET_FIRST_COLUMN, SET_COLUMNS_VISIBLE, SHOW_CONFIRM, REVERS_SORTING, SET_DELETED_PRODUCTS, HIDE_CONFIRM } from './mutation-types'
import { getProducts, deleteProducts } from '../api/request';
import { getCoords } from '../js/some-function';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        errorLoad: false, //не удалось загрузить список продуктов
        errorDelete: false, //не удалось удалить продукты
        isLoading: false,
        isDeleting: false,
        products: [], //загруженные продукты

        pageNumber: 0, //номер страницы
        productsTotalVisible: 10, //количество продуктов на странице

        productMatrix: [ //матрица для отрисовки таблицы продуктов
            { 'value': 'product', 'name': 'Product(100g serving)', 'checked': true },
            { 'value': 'calories', 'name': 'Calories', 'checked': true },
            { 'value': 'fat', 'name': 'Fat (g)', 'checked': true },
            { 'value': 'carbs', 'name': 'Carbs (g)', 'checked': true },
            { 'value': 'protein', 'name': 'Protein (g)', 'checked': true },
            { 'value': 'iron', 'name': 'Iron (%)', 'checked': true }
        ],
        sortingValue: '',
        isSortingReverse: false,

        productsToDelete: [], //список продуктов для удаления

        isDeleteOne: false,
        oneIdToDelete: '',

        isConfirmShow: false,
        confirmPosition: {},

    },
    getters: {
        productFirstIndex: state => { //индекс первого продукта на странице
            return state.pageNumber * state.productsTotalVisible
        },
        productLastIndex: state => { //индекс последнего продукта на странице
            let estimateLast = state.pageNumber * state.productsTotalVisible + state.productsTotalVisible
            if (state.products.length < estimateLast) {
                return state.products.length
            } else {
                return estimateLast
            }
        },
        productsOnPage: (state, getters) => { //возвращает список продуктов для страницы
            let sortProducts = state.products.sort(function (a, b) {
                if (a[state.sortingValue] < b[state.sortingValue]) return -1;
                if (a[state.sortingValue] > b[state.sortingValue]) return 1;
            })
            if (state.isSortingReverse) sortProducts.reverse()

            return sortProducts.slice(getters.productFirstIndex, getters.productLastIndex)
        },
        productMatrixChecked: (state) => { //матрица только видимых элементов
            return state.productMatrix.filter(item => item.checked === true)
        },
        hasVisibleColumns: state => { //есть ли активные колонки
            let total = state.productMatrix.filter(item => item.checked === true)
            if (total.length === 0) { return false } else { return true }
        },
        isCheckToDelete: state => id => { //проверяет есть ли продукт в массиве на удаление
            return state.productsToDelete.includes(id)
        },
        isAllCheckToDelete: (state, getters) => { //проверяет все ли товары на странице в массиве на удаление
            for (let i = 0; i < getters.productsOnPage.length; i++) {
                let isCheckDelete = state.productsToDelete.includes(getters.productsOnPage[i].id)
                if (!isCheckDelete) return false
            }
            return true
        }

    },
    mutations: {
        [GET_PRODUCTS](state) { //загружает продукты
            state.isLoading = true
            state.errorLoad = false
            getProducts().then(products => {
                if (state.errorLoad) state.errorLoad = false
                state.products = products
            }).catch(() => {
                state.errorLoad = true
            })
                .finally(() => {
                    state.isLoading = false
                })
        },
        [DELETE_PRODUCTS](state) { //удаляет продукты
            state.isDeleting = true
            deleteProducts().then(() => {
                if (state.errorDelete) state.errorDelete = false
                if (!state.isDeleteOne) {
                    for (let i = 0; i < state.productsToDelete.length; i++) {
                        let index = state.products.findIndex(item => item.id === state.productsToDelete[i])
                        state.products.splice(index, 1)
                    }
                    state.productsToDelete = []
                } else if (state.isDeleteOne) {
                    let indexInProducts = state.products.findIndex(item => item.id === state.oneIdToDelete),
                        indexInDelete = state.productsToDelete.findIndex(item => item === state.oneIdToDelete)
                    state.products.splice(indexInProducts, 1)
                    if (indexInDelete >= 0) state.productsToDelete.splice(indexInDelete, 1)
                }
                state.isConfirmShow = false
                state.isDeleteOne = false
            }
            ).catch(() => state.errorDelete = true)
                .finally(() => state.isDeleting = false)
        },
        [REVERS_SORTING](state) {
            state.isSortingReverse = !state.isSortingReverse
        },
        [SET_DELETED_PRODUCTS](state, value) { //изменяет список продуктов для удаления
            if (value.action === 'add') {
                for (let i = 0; i < value.id.length; i++) {
                    if (!state.productsToDelete.includes(value.id[i])) {
                        state.productsToDelete.push(value.id[i])
                    }
                }
            } else if (value.action === 'remove') {
                for (let i = 0; i < value.id.length; i++) {
                    let index = state.productsToDelete.findIndex(item => item === value.id[i])
                    state.productsToDelete.splice(index, 1)
                }
            }
        },
        [SET_PAGE_NUMBER](state, value) { //пагинация
            if (value === 'next' && state.pageNumber < Math.ceil(state.products.length / state.productsTotalVisible) - 1) {
                state.pageNumber++
            }
            else if (value === 'prev' && state.pageNumber > 0) {
                state.pageNumber--
            }
        },
        [SET_PRODUCTS_TOTAL_VISIBLE](state, value) { //меняет количество продуктов на странице
            state.productsTotalVisible = +value
        },
        [SET_FIRST_COLUMN](state, value) { //меняет первую колонку таблицы
            state.sortingValue = value
            let index = state.productMatrix.findIndex(item => item.value === value);
            [state.productMatrix[0], state.productMatrix[index]] = [state.productMatrix[index], state.productMatrix[0]]
            state.productMatrix.push()
        },
        [SET_COLUMNS_VISIBLE](state, array) { //меняет отображение колонок
            state.productMatrix.forEach(product => {
                let isChecked = array.includes(product.value)
                isChecked ? product.checked = true : product.checked = false
            })
        },
        [SHOW_CONFIRM](state, value) { // показать окно подтверждения
            state.isConfirmShow = true
            if (state.errorDelete) state.errorDelete = false
            if (value.id) { state.oneIdToDelete = value.id, state.isDeleteOne = true } //если приходит id, то event сработал для удаления одного продукта
            let coord = getCoords(value.event.target)
            state.confirmPosition = coord
        },
        [HIDE_CONFIRM](state) {
            state.isConfirmShow = false
            if (state.isDeleteOne) state.isDeleteOne = false
            state.oneIdToDelete = '' //сбрасывает выделение колонки таблицы
        }
    },
})