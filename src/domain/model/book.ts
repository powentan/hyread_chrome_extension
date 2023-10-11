type Book = {
    brn: string | null;
    assetUUID?: string | null;
    ownerCode?: string | null;
    title?: string | null;
    cover?: string | null;
    status?: BookStatus | null;
};

type BookStatus = {
    syncTime: number | null;
    udpateTime?: number | null;
    os: string | null;
    platform: string | null;
    position: number | null;
    progress?: number | null;
};

type BookMeta = {
    brn: string | null;
    title?: string | null;
    cover?: string | null;
    status?: BookStatus | null;
};

type BookSummary = {
    brn: string | null;
    title?: string | null;
    cover?: string | null;
    progress?: number | null;
    platform?: string| null;
};

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

enum AnnotationStyle {
    normal = 'normal',
    dashline = 'dashline',
    underline = 'underline',
}

type AnnotationResultItem = {
    data: string;
};

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
    Book,
    Annotation,
    AnnotationResultItem,
    AnnotationColor,
    AnnotationStyle,
    getAnnotationFontColor,
    BookStatus,
    BookMeta,
    BookSummary,
};
