import { settings, annotations, book } from "../../domain/service/common";
import MarkdownFormatAdapter from "@/infra/adapter/markdown_format/markdown_format";
import { FormatType } from "@/domain/repo/exporting";

describe('test markdown format adapter', () => {
    test('default format', () => {
        const _settings = {
            ...settings,
            format: FormatType.default,
        };
        const adapter = new MarkdownFormatAdapter(book, annotations, settings);

        adapter.toString();
    });

    test('hyread format', () => {
        const _settings = {
            ...settings,
            format: FormatType.hyRead,
        };
        const adapter = new MarkdownFormatAdapter(book, annotations, settings);
        adapter.toString();

    });

    test('hq&a format', () => {
        const _settings = {
            ...settings,
            format: FormatType.hqa,
        };
        const adapter = new MarkdownFormatAdapter(book, annotations, settings);
        adapter.toString();
    });

    test('color format', () => {
        const _settings = {
            ...settings,
            format: FormatType.color,
        };
        const adapter = new MarkdownFormatAdapter(book, annotations, settings);
        adapter.toString();
    });
});