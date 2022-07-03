export default class Cart {
  constructor () {
    this.cartItems = []
    this.render()
    this.initEventListeners()
  }

  getTemplate () {
    return `
      <div class="os-cart" data-element="modal">
        <div class="os-cart__container">
          <header class="os-cart__header">
            <p>Cart</p>
            <button class="os-cart__close" data-element="closeBtn"></button>
          </header>
          <main class="os-cart__main">
            <ul>
              <li></li>
            </ul>
            <footer class="os-cart__footer">
            
            </footer>
          </main>
        </div>
      </div>
    `
  }

  render () {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = this.getTemplate()
    this.element = wrapper.firstElementChild
  }

  initEventListeners () {
    const closeBtn = this.element.querySelector('[data-element="closeBtn"]')
    closeBtn.addEventListener('click', event => {
      this.close()
    })
  }

  open () {
    if (!this.element.classList.contains('os-cart--visible')) {
      this.element.classList.add('os-cart--visible')
    }
  }

  close () {
    if (this.element.classList.contains('os-cart--visible')) {
      this.element.classList.remove('os-cart--visible')
    }
  }
}
