const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const id = nanoid(32);
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher,
        pageCount, 
        readPage, 
        reading,
    } = request.payload;
    const finished = false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, 
        name,
        year,
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        finished, 
        reading, 
        insertedAt, 
        updatedAt,
    };

    const failCatches = (name === undefined) || (readPage > pageCount);
    if (failCatches) {
        const message = (name === undefined) 
            ? 'Gagal menambahkan buku. Mohon isi nama buku'
            : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';

        return h.response({
            status: 'fail',
            message,
        }).code(400);
    }

    books.push(newBook);

    const isSuccess = books.some((book) => book.id === id);

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    }).code(500);
    return response;
};

const getAllBooksHandler = (_, h) => {
    const copiedBooks = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    const response = h.response({
        status: 'success',
        data: {
            books: copiedBooks,
        },
    }).code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((b) => b.id === id)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        }).code(200);
        return response;
    }

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
};

const updateBookHandler = (request, h) => {
    const { id } = request.params;
    const {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading,
    } = request.payload;
    const index = books.findIndex((book) => book.id === id);
    const failCatches = (name === undefined) || (readPage > pageCount);

    if (failCatches) {
        const message = (name === undefined) 
            ? 'Gagal memperbarui buku. Mohon isi nama buku'
            : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';

        return h.response({
            status: 'fail',
            message,
        }).code(400);
    }

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    books[index] = {
        ...books[index],
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading,
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

const deleteBookHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(index, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookHandler,
    deleteBookHandler,
};
