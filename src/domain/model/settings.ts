type ReadWiseSettings = {
    accessToken?: string | null;
};

type AnnotationSettings = {
    filePrefix?: string | null;
};

type ExtensionSettings = {
    readwise?: ReadWiseSettings;
    annotation?: AnnotationSettings;
};

export { ReadWiseSettings, AnnotationSettings, ExtensionSettings };