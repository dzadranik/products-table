import Vue from 'vue'
import Vuex from 'vuex'
import {
	SET_PRODUCTS,
	DELETE_PRODUCTS,
	SET_ERROR,
	SET_IS_DELETING,
	SET_PAGE_NUMBER,
	SET_PRODUCTS_TOTAL_VISIBLE,
	SET_FIRST_COLUMN,
	SET_COLUMNS_VISIBLE,
	SHOW_CONFIRM,
	REVERS_SORTING,
	SET_DELETED_PRODUCTS,
	HIDE_CONFIRM,
	RESET_CONFIRM,
} from './mutation-types'
import { getProducts, deleteProducts } from '../api/request'
import { getCoords } from '../js/help-functions'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		errorLoad: false, //не удалось загрузить список продуктов
		errorDelete: false, //не удалось удалить продукты
		isDeleting: false,

		products: [], //загруженные продукты

		productsToDelete: [], //список продуктов для удаления
		productOneToDelete: '',
		isConfirmShow: false,
		confirmPosition: {},

		pageNumber: 0, //номер страницы
		productsTotalVisible: 10, //количество продуктов на странице
		sortingValue: '',
		isSortingReverse: false,

		productMatrix: [
			//матрица для отрисовки таблицы продуктов
			{ value: 'product', name: 'Product(100g serving)', checked: true },
			{ value: 'calories', name: 'Calories', checked: true },
			{ value: 'fat', name: 'Fat (g)', checked: true },
			{ value: 'carbs', name: 'Carbs (g)', checked: true },
			{ value: 'protein', name: 'Protein (g)', checked: true },
			{ value: 'iron', name: 'Iron (%)', checked: true },
		],
	},
	getters: {
		productFirstIndex: (state) => {
			//индекс первого продукта на странице
			return state.pageNumber * state.productsTotalVisible
		},
		productLastIndex: (state) => {
			//индекс последнего продукта на странице
			let estimateLast =
				state.pageNumber * state.productsTotalVisible +
				state.productsTotalVisible
			if (state.products.length < estimateLast) {
				return state.products.length
			} else {
				return estimateLast
			}
		},
		productsOnPage: (state, getters) => {
			//возвращает список продуктов для страницы
			let sortProducts = state.products
			if (state.sortingValue !== '') {
				sortProducts = state.products.slice().sort(function(a, b) {
					if (a[state.sortingValue] < b[state.sortingValue]) return -1
					if (a[state.sortingValue] > b[state.sortingValue]) return 1
				})
				if (state.isSortingReverse) sortProducts.reverse()
			}

			return sortProducts.slice(
				getters.productFirstIndex,
				getters.productLastIndex
			)
		},
		productMatrixChecked: (state) => {
			//матрица только видимых элементов
			return state.productMatrix.filter((item) => item.checked === true)
		},
		hasVisibleColumns: (state) => {
			//есть ли активные колонки
			let total = state.productMatrix.filter(
				(item) => item.checked === true
			)
			if (total.length === 0) {
				return false
			} else {
				return true
			}
		},
		isCheckToDelete: (state) => (id) => {
			//проверяет есть ли продукт в массиве на удаление
			return state.productsToDelete.includes(id)
		},
		isAllCheckToDelete: (state, getters) => {
			//проверяет все ли товары на странице в массиве на удаление
			for (let i = 0; i < getters.productsOnPage.length; i++) {
				let isCheckDelete = state.productsToDelete.includes(
					getters.productsOnPage[i].id
				)
				if (!isCheckDelete) return false
			}
			return true
		},
	},
	mutations: {
		[SET_PRODUCTS](state, products) {
			//загружает продукты
			state.products = products
		},
		[DELETE_PRODUCTS](state) {
			//удаляет продукты
			if (state.productOneToDelete === '') {
				//удалить список продуктов
				for (let i = 0; i < state.productsToDelete.length; i++) {
					let index = state.products.findIndex(
						(item) => item.id === state.productsToDelete[i]
					)
					state.products.splice(index, 1)
				}
				state.productsToDelete = []
			} else if (state.productOneToDelete !== '') {
				//удалить один продукт
				let indexInProducts = state.products.findIndex(
						(item) => item.id === state.productOneToDelete
					),
					indexInDelete = state.productsToDelete.findIndex(
						(item) => item === state.productOneToDelete
					)

				state.products.splice(indexInProducts, 1)
				if (indexInDelete >= 0)
					state.productsToDelete.splice(indexInDelete, 1)
			}
		},
		[SET_ERROR](state, data) {
			//чекер ошибок
			state[data.errorName] = data.errorValue
		},
		[SET_IS_DELETING](state) {
			state.isDeleting = !state.isDeleting
		},

		[SET_DELETED_PRODUCTS](state, value) {
			//изменяет список продуктов для удаления
			if (value.action === 'add') {
				for (let i = 0; i < value.id.length; i++) {
					if (!state.productsToDelete.includes(value.id[i])) {
						state.productsToDelete.push(value.id[i])
					}
				}
			} else if (value.action === 'remove') {
				for (let i = 0; i < value.id.length; i++) {
					let index = state.productsToDelete.findIndex(
						(item) => item === value.id[i]
					)
					state.productsToDelete.splice(index, 1)
				}
			}
		},

		[SHOW_CONFIRM](state, value) {
			// показать окно подтверждения
			state.isConfirmShow = true
			if (value.id) {
				state.productOneToDelete = value.id
			} //если приходит id, то event сработал для удаления одного продукта
			let coord = getCoords(value.event.target)
			state.confirmPosition = coord
		},
		[HIDE_CONFIRM](state) {
			state.isConfirmShow = false
		},
		[RESET_CONFIRM](state) {
			state.confirmPosition = {}
			if (state.errorDelete) state.errorDelete = false
			if (state.productOneToDelete !== '') state.productOneToDelete = '' //сбрасывает выделение колонки таблицы
		},

		[REVERS_SORTING](state) {
			state.isSortingReverse = !state.isSortingReverse
		},
		[SET_FIRST_COLUMN](state, value) {
			//меняет первую колонку таблицы
			if (state.sortingValue === value) {
				state.sortingValue = ''
			} else {
				state.sortingValue = value
			}
			let index = state.productMatrix.findIndex(
				(item) => item.value === value
			)
			;[state.productMatrix[0], state.productMatrix[index]] = [
				state.productMatrix[index],
				state.productMatrix[0],
			]
			state.productMatrix.push()
		},
		[SET_COLUMNS_VISIBLE](state, array) {
			//меняет отображение колонок
			state.productMatrix.forEach((product) => {
				let isChecked = array.includes(product.value)
				isChecked ? (product.checked = true) : (product.checked = false)
			})
		},
		[SET_PAGE_NUMBER](state, value) {
			//пагинация
			if (
				value === 'next' &&
				state.pageNumber <
					Math.ceil(
						state.products.length / state.productsTotalVisible
					) -
						1
			) {
				state.pageNumber++
			} else if (value === 'prev' && state.pageNumber > 0) {
				state.pageNumber--
			}
		},
		[SET_PRODUCTS_TOTAL_VISIBLE](state, value) {
			//меняет количество продуктов на странице
			state.productsTotalVisible = +value
		},
	},
	actions: {
		async loadProducts({ commit, state }) {
			if (state.errorLoad === true) {
				commit('SET_ERROR', {
					errorName: 'errorLoad',
					errorValue: false,
				})
			}
			try {
				const products = await getProducts()
				commit('SET_PRODUCTS', products)
			} catch {
				commit('SET_ERROR', {
					errorName: 'errorLoad',
					errorValue: true,
				})
			}
		},
		async deleteProducts({ commit }) {
			commit('SET_IS_DELETING')
			try {
				await deleteProducts()
				commit('DELETE_PRODUCTS')
				commit('HIDE_CONFIRM')
				commit('RESET_CONFIRM')
			} catch {
				commit('SET_ERROR', {
					errorName: 'errorDelete',
					errorValue: true,
				})
			}
			commit('SET_IS_DELETING')
		},
		setDeletedProducts({ commit }, value) {
			commit('SET_DELETED_PRODUCTS', value)
		},

		showConfirm({ commit, state }, value) {
			if (state.isConfirmShow === true) commit('RESET_CONFIRM')
			commit('SHOW_CONFIRM', value)
		},
		hideConfirm({ commit }) {
			commit('HIDE_CONFIRM')
			commit('RESET_CONFIRM')
		},

		reverseSorting({ commit }) {
			commit('REVERS_SORTING')
		},
		setFirstColumn({ commit }, value) {
			commit('SET_FIRST_COLUMN', value)
		},
		setColumnsVisible({ commit }, value) {
			commit('SET_COLUMNS_VISIBLE', value)
		},
		setPageNumber({ commit }, value) {
			commit('SET_PAGE_NUMBER', value)
		},
		setProductsTotalVisible({ commit }, value) {
			commit('SET_PRODUCTS_TOTAL_VISIBLE', value)
		},
	},
})
