// 1. Book class
class Book {
  constructor(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
  }
}

// 2. UI class
class UI {
  static displayBooks() {
    // const books = [
    //   {
    //     title: 'Book one',
    //     author: 'author 1',
    //     isbn: '10000',
    //   },
    //   {
    //     title: 'Book two',
    //     author: 'author 2',
    //     isbn: '20000',
    //   },
    //   {
    //     title: 'HTML/CSS/JS',
    //     author: 'author 3',
    //     isbn: '30000',
    //   },
    //   {
    //     title: 'Next-js',
    //     author: 'author 4',
    //     isbn: '40000',
    //   },
    // ]

    const books = Store.getBooks()
    books.forEach((book) => UI.addBookToList(book))
  }
  // 2.2 Add book to UI
  static addBookToList(book) {
    const list = document.getElementById('book-list')
    const row = document.createElement('tr')
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete"> X </a></td>
    `
    list.appendChild(row)
  }
  // 2.3 Clear Fields
  static clearfields() {
    document.querySelector('#title').value = ''
    document.querySelector('#author').value = ''
    document.querySelector('#isbn').value = ''
  }
  static showAlert(message, className) {
    const div = document.createElement('div')
    div.className = `alert alert-${className}`
    div.appendChild(document.createTextNode(message))
    const container = document.querySelector('.container')
    const form = document.querySelector('#book-form')
    container.insertBefore(div, form)
    setTimeout(() => document.querySelector('.alert').remove(), 2000)
  }

  static deleteBook(target) {
    console.log(target)
    target.parentElement.parentElement.remove()
    UI.showAlert('책이 삭제되었습니다', 'info')
  }
}
// 3. Store class : localStorage 활용 기능
class Store {
  // 3.1 localStorage에서 책정보를 읽어오는 기능
  static getBooks() {
    let books
    if (localStorage.getItem('books') === null) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }
    return books
  }
  // 3.2 localStorage에 새로운 책을 저장하는 기능
  static addBook(book) {
    const books = Store.getBooks()
    books.push(book)
    localStorage.setItem('books', JSON.stringify(books))
  }
  // 3.3 localStorage에서 책을 한권 지우는 기능
  static removeBook(isbn) {
    const books = Store.getBooks()
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1)
      }
    })
    localStorage.setItem('books', JSON.stringify(books))
  }
}
// 4. 사용자 이벤트 처리
// 4.1 페이지 초기 로드시 책 정보 표시
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// .4.2 책 한권 추가하는 이벤트

document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault()
  console.log(e.target)

  const title = document.querySelector('#title').value
  const author = document.querySelector('#author').value
  const isbn = document.querySelector('#isbn').value
  // 입력값 검증
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('모든 필드를 입력해 주세요...', 'danger')
  } else {
    const book = new Book(title, author, isbn)
    UI.addBookToList(book)
    Store.addBook(book)
    UI.clearfields()
    UI.showAlert('책이 저장되었습니다', 'success')
  }
})

// 4.3 책을 삭제하는 방법
document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target)
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})
