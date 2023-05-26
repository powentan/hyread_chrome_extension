type BookcaseBook = {
    assetUUID: string | null;
    eid?: string | null;
    ownerCode?: string | null;
    title?: string | null;
    cover?: string | null;
};

type HistoricalBook = {
    brn: string | null;
    title?: string | null;
    cover?: string | null;
};

type Book = BookcaseBook | HistoricalBook;

type Annotation = {
    chapterTitle: string;
    text: string;
    notes?: string;
};

type AnnotationResultItem = {
    data: string;
};

function isHistoricalBook(book: Book): book is HistoricalBook {
    return 'brn' in book;
}

export { isHistoricalBook, Book, HistoricalBook, Annotation, AnnotationResultItem };