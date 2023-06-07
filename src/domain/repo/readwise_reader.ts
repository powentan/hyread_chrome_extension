export interface ReadwiseReaderPort {
    create(obj: any): Promise<boolean>;
}