import Vue from 'vue'
import Vuex from 'vuex'
import { getProducts, deleteProducts } from '../api/request.js';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        products: [],
        productMatrix: [
            ['product', 'Product(100g serving)', true],
            ['calories', 'Calories', true],
            ['fat', 'Fat (g)', true],
            ['carbs', 'Carbs (g)', true],
            ['protein', 'Protein (g)', true],
            ['iron', 'Iron (%)', true]
        ],
        productsToDelete: [],
        loadAgain: false,

        pageNumber: 0,
        totalVisible: 10
    },
    getters: {
        firstProduct: state => {
            return state.pageNumber * state.totalVisible
        },
        lastProduct: state => {
            let estimateLast = state.pageNumber * state.totalVisible + state.totalVisible
            if (state.products.length < estimateLast) {
                return state.products.length
            } else {
                return estimateLast
            }
        },
        totalProducts: state => {
            return state.products.length
        },
        productsOnPage: (state, getters) => {
            return state.products.slice(getters.firstProduct, getters.lastProduct)
        },

    },
    mutations: {
        delete() {
            deleteProducts()
        },
        load(state) {
            state.loadAgain = false
            getProducts().then(products => {
                state.products = products
            }).catch(() => state.loadAgain = true)
        },

        changeDeleteArray(state, id) {
            let idIndex = state.productsToDelete.findIndex(item => item === id)
            if (idIndex >= 0) {
                state.productsToDelete.splice(idIndex, 1)
            } else { state.productsToDelete.push(id) }
        },

        deleteProduct(state, id) {
            state.products.findIndex(product => product.id === id)
        },

        changePage(state, value) {
            if (value === 'next' && state.pageNumber < Math.ceil(state.products.length / state.totalVisible) - 1) {
                state.pageNumber++
            }
            else if (value === 'prev' && state.pageNumber > 0) {
                state.pageNumber--
            }
        },

        changeTotalVisible(state, value) {
            state.totalVisible = +value
            state.pageNumber = 0
        }
    },
})