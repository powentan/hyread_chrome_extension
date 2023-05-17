type Book = {
    assetUUID: string | null;
    eid: string | null;
    ownerCode: string | null;
    title?: string | null;
    cover?: string | null;
};

type Annotation = {
    chapterTitle: string;
    text: string;
    notes?: string;
};

type AnnotationResultItem = {
    data: string;
};


export { Book, Annotation, AnnotationResultItem };