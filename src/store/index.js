import Vue from 'vue'
import Vuex from 'vuex'
import { CHANGE_PAGE, CHANGE_TOTAL_VISIBLE, CHANGE_FIRST_COLUMN } from './mutation-types'
import { getProducts, deleteProducts } from '../api/request.js';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        products: [], //загруженные продукты
        productMatrix: [ //матрица для отрисовки таблицы продуктов
            { 'value': 'product', 'name': 'Product(100g serving)', 'checked': true },
            { 'value': 'calories', 'name': 'Calories', 'checked': true },
            { 'value': 'fat', 'name': 'Fat (g)', 'checked': true },
            { 'value': 'carbs', 'name': 'Carbs (g)', 'checked': true },
            { 'value': 'protein', 'name': 'Protein (g)', 'checked': true },
            { 'value': 'iron', 'name': 'Iron (%)', 'checked': true }
        ],
        productsToDelete: [], //список продуктов для удаления
        loadAgain: false, //не удалось загрузить список продуктов

        pageNumber: 0, //номер страницы
        totalVisible: 10 //количество продуктов на странице
    },
    getters: {
        firstProduct: state => { //индекс первого продукта на странице
            return state.pageNumber * state.totalVisible
        },
        lastProduct: state => { //индекс последнего продукта на странице
            let estimateLast = state.pageNumber * state.totalVisible + state.totalVisible
            if (state.products.length < estimateLast) {
                return state.products.length
            } else {
                return estimateLast
            }
        },
        totalProducts: state => { //общее количество продуктов (навигация по страницам)
            return state.products.length
        },
        productsOnPage: (state, getters) => { //возвращает список продуктов для страницы
            return state.products.slice(getters.firstProduct, getters.lastProduct)
        },

    },
    mutations: {
        delete() {
            deleteProducts()
        },
        load(state) { //загружает продукты
            state.loadAgain = false
            getProducts().then(products => {
                state.products = products
            }).catch(() => state.loadAgain = true)
        },

        changeDeleteArray(state, id) { //изменяет список продуктов для удаления
            let idIndex = state.productsToDelete.findIndex(item => item === id)
            if (idIndex >= 0) {
                state.productsToDelete.splice(idIndex, 1)
            } else { state.productsToDelete.push(id) }
        },

        deleteProduct(state, id) { //удаляет продукт 
            state.products.findIndex(product => product.id === id)
        },

        [CHANGE_PAGE](state, value) { // пагинация
            if (value === 'next' && state.pageNumber < Math.ceil(state.products.length / state.totalVisible) - 1) {
                state.pageNumber++
            }
            else if (value === 'prev' && state.pageNumber > 0) {
                state.pageNumber--
            }
        },

        [CHANGE_TOTAL_VISIBLE](state, value) { //меняет количество продуктов на странице
            state.totalVisible = +value
            state.pageNumber = 0
        },

        [CHANGE_FIRST_COLUMN](state, value) { //меняет первую колонку таблицы
            let index = state.productMatrix.findIndex(item => item.value === value);
            [state.productMatrix[0], state.productMatrix[index]] = [state.productMatrix[index], state.productMatrix[0]]
            state.productMatrix.push()
        },

        changeDisplayColumn(state, value) { //меняет отображение колонок
            state.productMatrix.forEach(function (item) {
                item.checked = true
            })
            for (let i = 0; i < value.length; i++) {
                let index = state.productMatrix.findIndex(item => item.value === value[i].value);
                if (index >= 0) { state.productMatrix[index].checked = !state.productMatrix[index].checked }
            }
        }
    },
})