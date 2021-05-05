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
    const insertAt = new Date().toISOString();
    const updatedAt = insertAt;

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
        insertAt, 
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

module.exports = {
    addBookHandler,
};
