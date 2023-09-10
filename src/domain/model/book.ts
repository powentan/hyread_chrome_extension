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
    spineIndex: number;
    cfi: string;
    color: string;
    style: string;
};

enum AnnotationColor {
    color1 = 'annotation-color-1',
    color2 = 'annotation-color-2',
    color3 = 'annotation-color-3',
};

enum AnnotationFontColor {
    color1 = 'skyblue',
    color2 = 'pink',
    color3 = 'gold',
}

type AnnotationResultItem = {
    data: string;
};

function isHistoricalBook(book: Book): book is HistoricalBook {
    return 'brn' in book;
}

function getAnnotationFontColor(color: AnnotationColor): AnnotationFontColor {
    switch(color) {
        case AnnotationColor.color1:
            return AnnotationFontColor.color1;
        case AnnotationColor.color2:
            return AnnotationFontColor.color2;
        case AnnotationColor.color3:
            return AnnotationFontColor.color3;
    }
}

export {
    isHistoricalBook,
    Book,
    HistoricalBook,
    Annotation,
    AnnotationResultItem,
    AnnotationColor,
    getAnnotationFontColor,
};
