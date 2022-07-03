import CardsList from "./components/cards-list/index.js";
import Pagination from './components/pagination/index.js';
import SearchBox from './components/search-box/index.js';
import SideBar from './components/side-bar/index.js';
import Cart from './components/cart/index.js';

const BACKEND_URL = 'https://online-store.bootcamp.place/api/'

export default class OnlineStorePage {
  constructor () {
    this.components = {}
    this.products = []
    this.totalElements = 100
    this.filters = {
      _page: 1,
      _limit: 9,
      q: ''
    }
    this.filtersPanel = ''

    this.url = new URL('products', BACKEND_URL)

    this.initComponents()
    this.render()
    this.renderComponents()
    this.initEventListeners()

    this.update('_page', 1)
    console.log('this', this)
  }

  async loadData () {
    for (const key in this.filters) {
      if (this.filters[key]) {
        this.url.searchParams.set(key, this.filters[key])
      } else {
        this.url.searchParams.delete(key, this.filters[key])
      }
    }

    const response = await fetch(this.url + this.filtersPanel);

    this.totalElements = Number(response.headers.get('X-Total-Count'))
    const totalPages = Math.ceil(this.totalElements / this.filters._limit)

    const products = await response.json();
    return { products, totalPages };
  }

  getTemplate () {
    return `
      <div class="page" data-element="page">
        <div class="page-wrapper">
          <header class="os-header">
            <span class="os-page-title">Simple Store</span>
            
            <button class="os-btn os-cart-btn" data-element="cartBtn">
              <div class="os-cart-btn__icon"></div>
              <span>Cart</span>
            </button>
          </header>
          <main class="main-container">
            <aside class="os-sidebar-container" data-element="sideBar">
              <!-- Side Bar component -->
            </aside>
            <section>
              <div data-element="searchBox">
                <!-- Search Box component -->
              </div>
              <div data-element="cardsList">
                <!-- Cards List component -->
              </div>
              <div class="os-pagination-container" data-element="pagination">
                <!-- Pagination component -->
              </div>
            </section>
          </main>
        </div>
        <!-- Cart Modal component -->
      </div>      
    `
  }

  initComponents () {
    const totalPages = Math.ceil(this.totalElements / this.filters._limit)

    const cardsList = new CardsList(this.products)
    const pagination = new Pagination({
      activePageIndex: 0,
      totalPages
    })
    const searchBox = new SearchBox()
    const sideBar = new SideBar()
    const cart = new Cart()

    this.components.cardsList = cardsList
    this.components.pagination = pagination
    this.components.searchBox = searchBox
    this.components.sideBar = sideBar
    this.components.cart = cart
  }

  render () {
    const wrapper = document.createElement('div')

    wrapper.innerHTML = this.getTemplate()

    this.element = wrapper.firstElementChild
  }

  renderComponents () {
    const cardsContainer = this.element.querySelector('[data-element="cardsList"]')
    const paginationContainer = this.element.querySelector('[data-element="pagination"]')
    const searchBoxContainer = this.element.querySelector('[data-element="searchBox"]')
    const sideBarContainer = this.element.querySelector('[data-element="sideBar"]')

    cardsContainer.append(this.components.cardsList.element)
    paginationContainer.append(this.components.pagination.element)
    searchBoxContainer.append(this.components.searchBox.element)
    sideBarContainer.append(this.components.sideBar.element)

    this.element.appendChild(this.components.cart.element)
  }

  initEventListeners () {
    this.components.pagination.element.addEventListener('page-changed', event => {
      const pageIndex = Number(event.detail)

      this.update('_page', pageIndex + 1)
    })

    this.components.searchBox.element.addEventListener('search-changed', event => {
      const searchQuery = event.detail

      this.update('q', searchQuery)
    })

    this.components.sideBar.element.addEventListener('filters-changed', event => {
      const filtersArr = event.detail

      this.filtersPanel = filtersArr.length ? '&' + filtersArr.join('&') : ''
      this.update('q')
    })

    this.components.sideBar.element.addEventListener('filters-reset', event => {
      this.filtersPanel = ''
      this.components.searchBox.reset()
      this.filters.q = ''
      this.update('q')
    })

    const cartBtn = this.element.querySelector('[data-element="cartBtn"]')
    cartBtn.addEventListener('click', event => {
      this.components.cart.open()
    })
  }

  async update (filterName, filtervalue) {
    if (filterName && (typeof filtervalue === 'number' || typeof filtervalue === 'string')) {
      this.filters[filterName] = filtervalue
    }
    if (filterName === 'q') this.filters._page = 1

    const { products, totalPages } = await this.loadData()

    if (filterName === '_page') {
      this.components.cardsList.update(products)
    }
    if (filterName === 'q') {
      this.components.pagination.update(totalPages)
      this.components.cardsList.update(products)
    }

    console.log(this.filters);
  }
}















