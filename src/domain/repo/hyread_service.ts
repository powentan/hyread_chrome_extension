import { AnnotationResultItem } from '../model/book';

export interface HyReadServicePort {
    getAnnotation(assetUUID: string | null): Promise<Array<AnnotationResultItem>>;
}
