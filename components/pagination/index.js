export default class Pagination {
  constructor({ totalPages = 0, activePageIndex = 0 } = {}) {
    this.totalPages = totalPages
    this.activePageIndex = activePageIndex

    this.render()
    this.addListeners();
  }

  getTemplate () {
    return `
      <nav class="pagination pg-control">
        <a class="prev-control pg-control" data-element="nav-prev">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.354 1.64604C11.4006 1.69249 11.4375 1.74766 11.4628 1.80841C11.488 1.86915 11.5009 1.93427 11.5009 2.00004C11.5009 2.06581 11.488 2.13093 11.4628 2.19167C11.4375 2.25242 11.4006 2.30759 11.354 2.35404L5.70704 8.00004L11.354 13.646C11.4479 13.7399 11.5007 13.8673 11.5007 14C11.5007 14.1328 11.4479 14.2602 11.354 14.354C11.2602 14.4479 11.1328 14.5007 11 14.5007C10.8673 14.5007 10.7399 14.4479 10.646 14.354L4.64604 8.35404C4.59948 8.30759 4.56253 8.25242 4.53733 8.19167C4.51212 8.13093 4.49915 8.06581 4.49915 8.00004C4.49915 7.93427 4.51212 7.86915 4.53733 7.80841C4.56253 7.74766 4.59948 7.69248 4.64604 7.64604L10.646 1.64604C10.6925 1.59948 10.7477 1.56253 10.8084 1.53733C10.8692 1.51212 10.9343 1.49915 11 1.49915C11.0658 1.49915 11.1309 1.51212 11.1917 1.53733C11.2524 1.56253 11.3076 1.59948 11.354 1.64604Z" fill="black"/>
          </svg>
        </a>
        <ul class="pages" data-element="pagination">
          ${this.getPagesTemplate()}
        </ul>
        <a class="next-control pg-control" data-element="nav-next">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.64592 1.64604C4.69236 1.59948 4.74754 1.56253 4.80828 1.53733C4.86903 1.51212 4.93415 1.49915 4.99992 1.49915C5.06568 1.49915 5.13081 1.51212 5.19155 1.53733C5.2523 1.56253 5.30747 1.59948 5.35392 1.64604L11.3539 7.64604C11.4005 7.69248 11.4374 7.74766 11.4626 7.80841C11.4878 7.86915 11.5008 7.93427 11.5008 8.00004C11.5008 8.06581 11.4878 8.13093 11.4626 8.19167C11.4374 8.25242 11.4005 8.30759 11.3539 8.35404L5.35392 14.354C5.26003 14.4479 5.13269 14.5007 4.99992 14.5007C4.86714 14.5007 4.7398 14.4479 4.64592 14.354C4.55203 14.2602 4.49929 14.1328 4.49929 14C4.49929 13.8673 4.55203 13.7399 4.64592 13.646L10.2929 8.00004L4.64592 2.35404C4.59935 2.30759 4.56241 2.25242 4.5372 2.19167C4.512 2.13093 4.49902 2.06581 4.49902 2.00004C4.49902 1.93427 4.512 1.86915 4.5372 1.80841C4.56241 1.74766 4.59935 1.69249 4.64592 1.64604Z" fill="black"/>
          </svg>
        </a>
      </nav>
    `
  }

  getPagesTemplate () {
    let pages = []
    for (let i = 0; i < this.totalPages; i++) {
      const activeClass = i === this.activePageIndex ? 'active' : ''
      const page = `
        <li>
          <a
            href="#"
            class="pages__item pg-control ${activeClass}"
            data-page-index="${i}"
          >${i + 1}</a>
        </li>
      `
      pages.push(page)
    }
    return pages.join('')
  }

  setPage (pageIndex = 0) {
    if (pageIndex === this.activePageIndex) return;
    if (pageIndex > this.totalPages - 1 || pageIndex < 0) return;

    this.dispatchPageChangeEvent(pageIndex)

    const activePage = this.element.querySelector('.pages__item.active')

    if (activePage) {
      activePage.classList.remove('active')
    }

    const page = this.element.querySelector(`[data-page-index="${pageIndex}"]`)

    if (page) {
      page.classList.add('active')
    }

    this.activePageIndex = Number(pageIndex);
  }

  nextPage () {
    const nextPageIndex = this.activePageIndex + 1;

    this.setPage(nextPageIndex)
  }

  prevPage () {
    const prevPageIndex = this.activePageIndex - 1;

    this.setPage(prevPageIndex)
  }

  render () {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = this.getTemplate()
    this.element = wrapper.firstElementChild
  }

  addListeners () {
    const prevPageBtn = this.element.querySelector('[data-element="nav-prev"]')
    const nextPageBtn = this.element.querySelector('[data-element="nav-next"]')
    const pageList = this.element.querySelector('[data-element="pagination"]')

    prevPageBtn.addEventListener('click', () => {
      this.prevPage()
    })

    nextPageBtn.addEventListener('click', () => {
      this.nextPage()
    })

    pageList.addEventListener('click', event => {
      const pageItem = event.target.closest('.pages__item')

      if (!pageItem) return;

      this.setPage(pageItem.dataset.pageIndex)
    })
  }

  dispatchPageChangeEvent (pageIndex) {
    const customEvent = new CustomEvent('page-changed', {
      detail: pageIndex
    })

    this.element.dispatchEvent(customEvent)
  }

  update (totalPages = 0) {
    this.totalPages = totalPages
    this.activePageIndex = 0

    const pagination = this.element.querySelector('[data-element="pagination"]')
    pagination.innerHTML = this.getPagesTemplate()
  }
}
