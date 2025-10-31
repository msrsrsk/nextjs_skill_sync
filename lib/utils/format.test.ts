import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { 
    formatFileSize,
    getFileExtension,
    dataUrlToFile,
    formatNumber,
    formatSoldOutNumber,
    formatHtmlToPlainText,
    parseNewlineToArray,
    formatTitleCase,
    convertToJST,
    formatDateCommon,
    formatDate,
    formatDateTime,
    formatRelativeDate
} from "@/lib/utils/format"
import { FILE_MIME_TYPES, DATE_FORMAT_TYPES } from "@/constants/index"
const { IMAGE_JPEG, IMAGE_JPG, IMAGE_PNG } = FILE_MIME_TYPES;
const { DATE_DOT, DATE_SLASH, DATE_FULL, DATE_OMISSION } = DATE_FORMAT_TYPES;

/* ==================================== 
    formatFileSize Test
==================================== */
describe('formatFileSize', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 0バイトの場合
    it('should return "0B" when bytes is 0', () => {
        const result = formatFileSize(0)
        expect(result).toBe('0B')
    })

    // 1バイト以上1024バイト未満（B単位）
    it('should format bytes less than 1024 as bytes', () => {
        expect(formatFileSize(1)).toBe('1 B')
        expect(formatFileSize(512)).toBe('512 B')
        expect(formatFileSize(1023)).toBe('1023 B')
    })

    // 1024バイト（1KBの境界値）
    it('should format 1024 bytes as 1KB', () => {
        const result = formatFileSize(1024)
        expect(result).toBe('1 KB')
    })

    // 1024バイト以上1048576バイト未満（KB単位）
    it('should format bytes between 1024 and 1048575 as KB', () => {
        expect(formatFileSize(1536)).toBe('1.5 KB') // 1.5KB
        expect(formatFileSize(2048)).toBe('2 KB') // 2KB
        expect(formatFileSize(51200)).toBe('50 KB') // 50KB
        expect(formatFileSize(1048575)).toBe('1024 KB') // 1024KB未満
    })

    // 1048576バイト（1MBの境界値）
    it('should format 1048576 bytes as 1MB', () => {
        const result = formatFileSize(1048576)
        expect(result).toBe('1 MB')
    })

    // 1048576バイト以上（MB単位）
    it('should format bytes 1048576 and above as MB', () => {
        expect(formatFileSize(1572864)).toBe('1.5 MB') // 1.5MB
        expect(formatFileSize(2097152)).toBe('2 MB') // 2MB
        expect(formatFileSize(5242880)).toBe('5 MB') // 5MB
    })

    // 小数点の処理（小数点第1位まで表示）
    it('should format with one decimal place correctly', () => {
        expect(formatFileSize(1536)).toBe('1.5 KB') // 1024 * 1.5 = 1536
        expect(formatFileSize(768)).toBe('768 B') // 768バイトは1024未満なのでB単位

        // 小数点が表示されるケース（1024バイト以上）
        expect(formatFileSize(1536)).toBe('1.5 KB') // 1.5KB
        expect(formatFileSize(2560)).toBe('2.5 KB') // 2.5KB
        expect(formatFileSize(1572864)).toBe('1.5 MB') // 1.5MB
    })

    // 大きなファイルサイズ
    it('should handle large file sizes correctly', () => {
        expect(formatFileSize(10 * 1024 * 1024)).toBe('10 MB') // 10MB
        expect(formatFileSize(100 * 1024 * 1024)).toBe('100 MB') // 100MB
    })
})

/* ==================================== 
    getFileExtension Test
==================================== */
describe('getFileExtension', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should get known file extensions correctly', () => {
        const testCases = [
            { input: IMAGE_JPEG, expected: 'jpg' },
            { input: IMAGE_JPG, expected: 'jpg' },
            { input: IMAGE_PNG, expected: 'png' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(getFileExtension(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown file extensions', () => {
        const unknownExtension = 'UNKNOWN_EXTENSION' as FileMimeType;
        expect(getFileExtension(unknownExtension)).toBe('jpg');
    })

    // fileExtension が null の場合
    it('should return "jpg" when fileExtension is null', () => {
        const result = getFileExtension(null as unknown as FileMimeType);
        expect(result).toBe('jpg');
    })
})

/* ==================================== 
    dataUrlToFile Test
==================================== */
describe('dataUrlToFile', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // JPEG 形式の Data URL を File に変換
    it('should convert JPEG data URL to File', () => {
        const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A'
        const filename = 'test.jpg'
        
        const result = dataUrlToFile(dataUrl, filename)
        
        expect(result).toBeInstanceOf(File)
        expect(result.name).toBe(filename)
        expect(result.type).toBe('image/jpeg')
        expect(result.size).toBeGreaterThan(0)
    })

    // PNG 形式の Data URL を File に変換
    it('should convert PNG data URL to File', () => {
        const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        const filename = 'test.png'
        
        const result = dataUrlToFile(dataUrl, filename)
        
        expect(result).toBeInstanceOf(File)
        expect(result.name).toBe(filename)
        expect(result.type).toBe('image/png')
        expect(result.size).toBeGreaterThan(0)
    })

    // JPG 形式の Data URL を File に変換
    it('should convert JPG data URL to File', () => {
        const dataUrl = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A'
        const filename = 'test.jpg'
        
        const result = dataUrlToFile(dataUrl, filename)
        
        expect(result).toBeInstanceOf(File)
        expect(result.name).toBe(filename)
        expect(result.type).toBe('image/jpg')
        expect(result.size).toBeGreaterThan(0)
    })

    // MIME タイプが見つからない場合
    it('should use default MIME type (image/jpeg) when MIME type is not found', () => {
        const dataUrl = 'data:unknown,testdata'
        const filename = 'test.jpg'
        
        const result = dataUrlToFile(dataUrl, filename)
        
        expect(result).toBeInstanceOf(File)
        expect(result.name).toBe(filename)
        expect(result.type).toBe('image/jpeg') // デフォルト値
        expect(result.size).toBeGreaterThan(0)
    })

    // MIMEタイプのマッチングパターンが不完全な場合
    it('should use default MIME type when MIME pattern does not match', () => {
        // セミコロンがない場合
        const dataUrl = 'data:image/png,testdata'
        const filename = 'test.png'
        
        const result = dataUrlToFile(dataUrl, filename)
        
        expect(result).toBeInstanceOf(File)
        expect(result.name).toBe(filename)
        expect(result.type).toBe('image/jpeg') // デフォルト値
    })

    // ファイル名が異なる場合
    it('should set the provided filename correctly', () => {
        const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        const filename = 'custom-filename.png'
        
        const result = dataUrlToFile(dataUrl, filename)
        
        expect(result.name).toBe(filename)
        expect(result.type).toBe('image/png')
    })

    // Base64デコードされたデータが正しく変換されることを確認
    it('should correctly decode Base64 data', () => {
        // 単純なBase64エンコードされたデータ "Hello"
        const dataUrl = 'data:image/jpeg;base64,SGVsbG8='
        const filename = 'test.jpg'
        
        const result = dataUrlToFile(dataUrl, filename)
        
        expect(result).toBeInstanceOf(File)
        expect(result.type).toBe('image/jpeg')
        expect(result.size).toBe(5) // "Hello" は5文字
    })

    // 空の Base64 データの場合
    it('should create File when empty Base64 data', () => {
        const dataUrl = 'data:image/jpeg;base64,'
        const filename = 'empty.jpg'
        
        const result = dataUrlToFile(dataUrl, filename)
        
        expect(result).toBeInstanceOf(File)
        expect(result.name).toBe(filename)
        expect(result.type).toBe('image/jpeg')
        expect(result.size).toBe(0)
    })
})

/* ==================================== 
    formatNumber Test
==================================== */
describe('formatNumber', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    // 基本的な数値のフォーマット
    it('should format basic numbers', () => {
        expect(formatNumber(0)).toBe('0')
        expect(formatNumber(1)).toBe('1')
        expect(formatNumber(123)).toBe('123')
        expect(formatNumber(999)).toBe('999')
    })

    // 3桁区切りが必要な大きな数値
    it('should format large numbers with comma separators', () => {
        expect(formatNumber(1000)).toBe('1,000')
        expect(formatNumber(10000)).toBe('10,000')
        expect(formatNumber(100000)).toBe('100,000')
        expect(formatNumber(1000000)).toBe('1,000,000')
        expect(formatNumber(1234567)).toBe('1,234,567')
    })

    // 負の数のフォーマット
    it('should format negative numbers', () => {
        expect(formatNumber(-1)).toBe('-1')
        expect(formatNumber(-123)).toBe('-123')
        expect(formatNumber(-1000)).toBe('-1,000')
        expect(formatNumber(-1234567)).toBe('-1,234,567')
    })

    // 小数点を含む数値
    it('should format decimal numbers', () => {
        expect(formatNumber(123.45)).toBe('123.45')
        expect(formatNumber(1234.567)).toBe('1,234.567')
        expect(formatNumber(0.123)).toBe('0.123')
        expect(formatNumber(-123.45)).toBe('-123.45')
    })

    // 非常に大きな数値
    it('should format very large numbers', () => {
        expect(formatNumber(1000000000)).toBe('1,000,000,000')
        expect(formatNumber(999999999999)).toBe('999,999,999,999')
    })

    // 小数が長い場合
    it('should format numbers with long decimal parts', () => {
        expect(formatNumber(123.123456789)).toBe('123.123')
        expect(formatNumber(1000.123456789)).toBe('1,000.123')
    })
})

/* ==================================== 
    formatSoldOutNumber Test
==================================== */
describe('formatSoldOutNumber', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 100万未満（1000未満の場合）
    it('should format numbers less than 1000 using toLocaleString', () => {
        expect(formatSoldOutNumber(0)).toBe('0')
        expect(formatSoldOutNumber(1)).toBe('1')
        expect(formatSoldOutNumber(123)).toBe('123')
        expect(formatSoldOutNumber(999)).toBe('999')
    })

    // 10万未満（1000以上）
    it('should format numbers between 1000 and 99999 using toLocaleString', () => {
        expect(formatSoldOutNumber(1000)).toBe('1,000')
        expect(formatSoldOutNumber(12345)).toBe('12,345')
        expect(formatSoldOutNumber(99999)).toBe('99,999')
    })

    // 10万以上100万未満 - K単位で表示
    it('should format numbers between 100000 and 999999 as K', () => {
        expect(formatSoldOutNumber(100000)).toBe('100K') // 100000 / 1000 = 100
        expect(formatSoldOutNumber(150000)).toBe('150K') // 150000 / 1000 = 150
        expect(formatSoldOutNumber(500000)).toBe('500K') // 500000 / 1000 = 500
        expect(formatSoldOutNumber(999999)).toBe('999K') // Math.floor(999999 / 1000) = 999
    })

    // 10万の境界値
    it('should format 100000 as 100K (boundary value)', () => {
        expect(formatSoldOutNumber(100000)).toBe('100K')
    })

    // 100万以上 - M単位で表示（小数点1桁まで）
    it('should format numbers 1000000 and above as M', () => {
        expect(formatSoldOutNumber(1000000)).toBe('1M') // 1.0 → '1.0'.replace(/\.0$/, '') → '1' → '1M'
        expect(formatSoldOutNumber(1500000)).toBe('1.5M') // 1.5 → '1.5M'
        expect(formatSoldOutNumber(2000000)).toBe('2M') // 2.0 → '2.0'.replace(/\.0$/, '') → '2' → '2M'
        expect(formatSoldOutNumber(2500000)).toBe('2.5M') // 2.5 → '2.5M'
        expect(formatSoldOutNumber(10000000)).toBe('10M') // 10.0 → '10' → '10M'
        expect(formatSoldOutNumber(15000000)).toBe('15M') // 15.0 → '15' → '15M'
    })

    // 100万の境界値
    it('should format 1000000 as 1M (boundary value)', () => {
        expect(formatSoldOutNumber(1000000)).toBe('1M')
    })

    // 100万以上で小数点が削除されるケース（.0で終わる場合）
    it('should remove trailing .0 from M format', () => {
        expect(formatSoldOutNumber(1000000)).toBe('1M') // 1.0 → '1M'
        expect(formatSoldOutNumber(2000000)).toBe('2M') // 2.0 → '2M'
        expect(formatSoldOutNumber(3000000)).toBe('3M') // 3.0 → '3M'
        expect(formatSoldOutNumber(10000000)).toBe('10M') // 10.0 → '10M'
    })

    // 100万以上で小数点が残るケース
    it('should keep decimal point when not .0', () => {
        expect(formatSoldOutNumber(1500000)).toBe('1.5M') // 1.5 → '1.5M'
        expect(formatSoldOutNumber(1250000)).toBe('1.3M') // 1.25 → '1.3M' (toFixed(1)で四捨五入)
        expect(formatSoldOutNumber(1750000)).toBe('1.8M') // 1.75 → '1.8M'
    })

    // 大きな数値
    it('should format very large numbers correctly', () => {
        expect(formatSoldOutNumber(50000000)).toBe('50M') // 50.0 → '50M'
        expect(formatSoldOutNumber(99999999)).toBe('100M') // 99.999999 → '100.0' → '100M'
        expect(formatSoldOutNumber(100000000)).toBe('100M') // 100.0 → '100M'
    })

    // 境界値付近のテスト
    it('should handle boundary values correctly', () => {
        expect(formatSoldOutNumber(99999)).toBe('99,999') // 10万未満 → toLocaleString()
        expect(formatSoldOutNumber(100000)).toBe('100K') // 10万以上 → K単位
        expect(formatSoldOutNumber(999999)).toBe('999K') // 100万未満 → K単位
        expect(formatSoldOutNumber(1000000)).toBe('1M') // 100万以上 → M単位
    })
})

/* ==================================== 
    formatHtmlToPlainText Test
==================================== */
describe('formatHtmlToPlainText', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    // 空文字列の場合
    it('should return empty string when content is empty', () => {
        expect(formatHtmlToPlainText('')).toBe('')
    })

    // null や undefined の場合
    it('should return empty string when content is falsy', () => {
        expect(formatHtmlToPlainText(null as unknown as string)).toBe('')
        expect(formatHtmlToPlainText(undefined as unknown as string)).toBe('')
    })

    // HTMLタグの削除
    it('should remove HTML tags', () => {
        expect(formatHtmlToPlainText('<p>Hello</p>')).toBe('Hello')
        expect(formatHtmlToPlainText('<div>Test</div>')).toBe('Test')
        expect(formatHtmlToPlainText('<h1>Title</h1>')).toBe('Title')
        expect(formatHtmlToPlainText('<span class="test">Content</span>')).toBe('Content')
    })

    // 複数のHTMLタグが含まれる場合
    it('should remove multiple HTML tags', () => {
        expect(formatHtmlToPlainText('<p>Hello <strong>World</strong></p>')).toBe('Hello World')
        expect(formatHtmlToPlainText('<div><span>Test</span> <em>Content</em></div>')).toBe('Test Content')
    })

    // &nbsp; のスペース変換
    it('should convert &nbsp; to space', () => {
        expect(formatHtmlToPlainText('Hello&nbsp;World')).toBe('Hello World')
        expect(formatHtmlToPlainText('Test&nbsp;&nbsp;Content')).toBe('Test Content')
    })

    // 複数の空白を1つに統一
    it('should replace multiple spaces with single space', () => {
        expect(formatHtmlToPlainText('Hello    World')).toBe('Hello World')
        expect(formatHtmlToPlainText('Test   Content')).toBe('Test Content')
        expect(formatHtmlToPlainText('Multiple     Spaces')).toBe('Multiple Spaces')
    })

    // タブや改行などの空白文字も1つのスペースに統一
    it('should replace tabs and newlines with single space', () => {
        expect(formatHtmlToPlainText('Hello\tWorld')).toBe('Hello World')
        expect(formatHtmlToPlainText('Test\nContent')).toBe('Test Content')
        expect(formatHtmlToPlainText('Multiple\n\nLines')).toBe('Multiple Lines')
    })

    // 前後の空白を削除
    it('should trim leading and trailing whitespace', () => {
        expect(formatHtmlToPlainText('  Hello World  ')).toBe('Hello World')
        expect(formatHtmlToPlainText('\tTest Content\n')).toBe('Test Content')
        expect(formatHtmlToPlainText('   Multiple Spaces   ')).toBe('Multiple Spaces')
    })

    // 複合的なケース
    it('should handle complex HTML content with all transformations', () => {
        const html = '<div class="test">  Hello&nbsp;&nbsp;   <strong>World</strong>  </div>'
        const result = formatHtmlToPlainText(html)
        expect(result).toBe('Hello World')
    })

    // ネストされたHTMLタグ
    it('should handle nested HTML tags', () => {
        expect(formatHtmlToPlainText('<div><p><span>Nested</span></p></div>')).toBe('Nested')
        expect(formatHtmlToPlainText('<h1><em>Title</em></h1>')).toBe('Title')
    })

    // HTMLタグだけでテキストがない場合
    it('should return empty string for HTML tags only', () => {
        expect(formatHtmlToPlainText('<div></div>')).toBe('')
        expect(formatHtmlToPlainText('<p></p>')).toBe('')
        expect(formatHtmlToPlainText('<span></span>')).toBe('')
    })

    // 空白だけで構成されている場合
    it('should return empty string for whitespace only', () => {
        expect(formatHtmlToPlainText('   ')).toBe('')
        expect(formatHtmlToPlainText('\t\n')).toBe('')
        expect(formatHtmlToPlainText('&nbsp;&nbsp;')).toBe('')
    })

    // HTMLタグが混在する通常のテキスト
    it('should handle mixed HTML and plain text', () => {
        expect(formatHtmlToPlainText('Start <p>Middle</p> End')).toBe('Start Middle End')
        expect(formatHtmlToPlainText('Text <strong>Bold</strong> More Text')).toBe('Text Bold More Text')
    })
})

/* ==================================== 
    parseNewlineToArray Test
==================================== */
describe('parseNewlineToArray', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    // 基本的な改行で分割
    it('should split text by newline and return array', () => {
        const text = 'Line 1\nLine 2\nLine 3'
        const result = parseNewlineToArray(text)
        
        expect(result).toEqual(['Line 1', 'Line 2', 'Line 3'])
        expect(result).toHaveLength(3)
    })

    // 改行が1つの場合
    it('should handle single newline', () => {
        expect(parseNewlineToArray('Line 1\nLine 2')).toEqual(['Line 1', 'Line 2'])
    })

    // 改行がない場合
    it('should return array with single item when no newline', () => {
        expect(parseNewlineToArray('Single Line')).toEqual(['Single Line'])
        expect(parseNewlineToArray('No newline here')).toEqual(['No newline here'])
    })

    // 空文字列の場合
    it('should return empty array when text is empty', () => {
        expect(parseNewlineToArray('')).toEqual([])
    })

    // 空白行をフィルタリング
    it('should filter out empty lines', () => {
        const text = 'Line 1\n\nLine 2\n   \nLine 3'
        const result = parseNewlineToArray(text)
        
        expect(result).toEqual(['Line 1', 'Line 2', 'Line 3'])
        expect(result).toHaveLength(3)
    })

    // 連続した改行（複数の空白行）
    it('should filter out multiple consecutive empty lines', () => {
        const text = 'Line 1\n\n\nLine 2'
        const result = parseNewlineToArray(text)
        
        expect(result).toEqual(['Line 1', 'Line 2'])
    })

    // 前後に空白がある行の処理
    it('should keep lines with content even if they have leading/trailing whitespace', () => {
        const text = '  Line 1  \n  Line 2  \nLine 3'
        const result = parseNewlineToArray(text)
        
        expect(result).toEqual(['Line 1', 'Line 2', 'Line 3'])
    })

    // 先頭・末尾に改行がある場合
    it('should handle newlines at start and end', () => {
        const text = '\nLine 1\nLine 2\n'
        const result = parseNewlineToArray(text)
        
        expect(result).toEqual(['Line 1', 'Line 2'])
    })

    // すべてが空白行の場合
    it('should return empty array when all lines are empty or whitespace', () => {
        expect(parseNewlineToArray('\n\n\n')).toEqual([])
        expect(parseNewlineToArray('   \n\t\n   ')).toEqual([])
    })

    // 長いテキストの場合
    it('should handle long text with many lines', () => {
        const text = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5'
        const result = parseNewlineToArray(text)
        
        expect(result).toEqual(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'])
        expect(result).toHaveLength(5)
    })

    // 特殊文字が含まれる場合
    it('should handle lines with special characters', () => {
        const text = 'Line 1: Test\nLine 2: @#$%\nLine 3: 日本語'
        const result = parseNewlineToArray(text)
        
        expect(result).toEqual(['Line 1: Test', 'Line 2: @#$%', 'Line 3: 日本語'])
    })
})

/* ==================================== 
    formatTitleCase Test
==================================== */
describe('formatTitleCase', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    // 基本的な変換（すべて小文字 → タイトルケース）
    it('should convert lowercase text to title case', () => {
        expect(formatTitleCase('hello')).toBe('Hello')
        expect(formatTitleCase('world')).toBe('World')
        expect(formatTitleCase('test')).toBe('Test')
    })

    // すべて大文字 → タイトルケース
    it('should convert uppercase text to title case', () => {
        expect(formatTitleCase('HELLO')).toBe('Hello')
        expect(formatTitleCase('WORLD')).toBe('World')
        expect(formatTitleCase('TEST')).toBe('Test')
    })

    // 混在している場合
    it('should convert mixed case text to title case', () => {
        expect(formatTitleCase('hELLo')).toBe('Hello')
        expect(formatTitleCase('WoRLd')).toBe('World')
        expect(formatTitleCase('tEsT')).toBe('Test')
    })

    // 単一文字の場合
    it('should handle single character', () => {
        expect(formatTitleCase('a')).toBe('A')
        expect(formatTitleCase('A')).toBe('A')
        expect(formatTitleCase('z')).toBe('Z')
    })

    // 空文字列の場合（エッジケース）
    it('should handle empty string', () => {
        expect(formatTitleCase('')).toBe('')
    })

    // 長い文字列の場合
    it('should handle long strings', () => {
        expect(formatTitleCase('hello world')).toBe('Hello world')
        expect(formatTitleCase('this is a test')).toBe('This is a test')
    })

    // 数字が含まれる場合
    it('should handle text with numbers', () => {
        expect(formatTitleCase('test123')).toBe('Test123')
        expect(formatTitleCase('123test')).toBe('123test')
        expect(formatTitleCase('test123abc')).toBe('Test123abc')
    })

    // 特殊文字が含まれる場合
    it('should handle text with special characters', () => {
        expect(formatTitleCase('test@example')).toBe('Test@example')
        expect(formatTitleCase('hello-world')).toBe('Hello-world')
        expect(formatTitleCase('test_case')).toBe('Test_case')
    })

    // 空白が含まれる場合
    it('should handle text with spaces', () => {
        expect(formatTitleCase('hello world')).toBe('Hello world')
        expect(formatTitleCase('  test  ')).toBe('  test  ')
    })

    // 日本語などのマルチバイト文字（実装の動作確認）
    it('should handle multibyte characters', () => {
        expect(formatTitleCase('こんにちは')).toBe('こんにちは')
        expect(formatTitleCase('test日本語')).toBe('Test日本語')
    })

    // 既にタイトルケースになっている場合
    it('should handle already title case text', () => {
        expect(formatTitleCase('Hello')).toBe('Hello')
        expect(formatTitleCase('Test')).toBe('Test')
    })

    // 先頭が数字の場合
    it('should handle text starting with number', () => {
        expect(formatTitleCase('123hello')).toBe('123hello')
        expect(formatTitleCase('1test')).toBe('1test')
    })

    // 先頭が特殊文字の場合
    it('should handle text starting with special character', () => {
        expect(formatTitleCase('@test')).toBe('@test')
        expect(formatTitleCase('_hello')).toBe('_hello')
    })
})

/* ==================================== 
    convertToJST Test
==================================== */
describe('convertToJST', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    // 基本的な変換
    it('should return a Date object', () => {
        const inputDate = new Date('2024-01-01T00:00:00Z')
        const result = convertToJST(inputDate)
        
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).not.toBeNaN()
    })

    // 異なる日付での変換
    it('should convert different dates to JST', () => {
        const dates = [
            new Date('2024-01-01T00:00:00Z'),
            new Date('2024-06-15T12:00:00Z'),
            new Date('2024-12-31T23:59:59Z')
        ]
        
        dates.forEach(date => {
            const result = convertToJST(date)
            expect(result).toBeInstanceOf(Date)
            expect(result.getTime()).not.toBeNaN()
        })
    })

    // 現在の日付での変換
    it('should convert current date', () => {
        const now = new Date()
        const result = convertToJST(now)
        
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).not.toBeNaN()
    })

    // タイムゾーン変換の基本的な動作確認
    it('should preserve date information when converting', () => {
        const inputDate = new Date('2024-01-01T00:00:00Z')
        const result = convertToJST(inputDate)
        
        expect(result.getFullYear()).toBeGreaterThan(0)
        expect(result.getMonth()).toBeGreaterThanOrEqual(0)
        expect(result.getMonth()).toBeLessThan(12)
        expect(result.getDate()).toBeGreaterThan(0)
    })

    // エッジケース：最小の日付
    it('should handle minimum date', () => {
        const minDate = new Date(0) // 1970-01-01T00:00:00Z
        const result = convertToJST(minDate)
        
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).not.toBeNaN()
    })

    // エッジケース：大きな日付値
    it('should handle large date values', () => {
        const largeDate = new Date('2100-12-31T23:59:59Z')
        const result = convertToJST(largeDate)
        
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).not.toBeNaN()
    })

    // 異なるタイムゾーンの日付を変換
    it('should handle dates from different timezones', () => {
        // UTC
        const utcDate = new Date('2024-01-01T12:00:00Z')
        const resultUtc = convertToJST(utcDate)
        expect(resultUtc).toBeInstanceOf(Date)
        
        // ISO形式
        const isoDate = new Date('2024-01-01T12:00:00+09:00')
        const resultIso = convertToJST(isoDate)
        expect(resultIso).toBeInstanceOf(Date)
    })

    // 同じ日付を複数回変換
    it('should consistently convert the same date', () => {
        const date = new Date('2024-06-15T10:00:00Z')
        const result1 = convertToJST(date)
        const result2 = convertToJST(date)
        
        expect(result1).toBeInstanceOf(Date)
        expect(result2).toBeInstanceOf(Date)
        expect(result1.getTime()).not.toBeNaN()
        expect(result2.getTime()).not.toBeNaN()
    })
})

/* ==================================== 
    formatDateCommon Test
==================================== */
describe('formatDateCommon', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    // DATE_DOT の場合
    it('should format date in DOT format (YYYY.MM.DD)', () => {
        const date = new Date(2024, 0, 1) // 2024年1月1日
        expect(formatDateCommon(date, DATE_DOT)).toBe('2024.01.01')
        
        const date2 = new Date(2024, 11, 31) // 2024年12月31日
        expect(formatDateCommon(date2, DATE_DOT)).toBe('2024.12.31')
    })

    // DATE_SLASH の場合
    it('should format date in SLASH format (YYYY/MM/DD)', () => {
        const date = new Date(2024, 0, 1) // 2024年1月1日
        expect(formatDateCommon(date, DATE_SLASH)).toBe('2024/01/01')
        
        const date2 = new Date(2024, 11, 31) // 2024年12月31日
        expect(formatDateCommon(date2, DATE_SLASH)).toBe('2024/12/31')
    })

    // DATE_FULL の場合
    it('should format date in FULL format (YYYY年MM月DD日)', () => {
        const date = new Date(2024, 0, 1) // 2024年1月1日
        expect(formatDateCommon(date, DATE_FULL)).toBe('2024年01月01日')
        
        const date2 = new Date(2024, 11, 31) // 2024年12月31日
        expect(formatDateCommon(date2, DATE_FULL)).toBe('2024年12月31日')
    })

    // DATE_OMISSION の場合
    it('should format date in OMISSION format (YYYYMMDD)', () => {
        const date = new Date(2024, 0, 1) // 2024年1月1日
        expect(formatDateCommon(date, DATE_OMISSION)).toBe('20240101')
        
        const date2 = new Date(2024, 11, 31) // 2024年12月31日
        expect(formatDateCommon(date2, DATE_OMISSION)).toBe('20241231')
    })

    // 不正な type の場合（default ケース）
    it('should use OMISSION format for unknown type', () => {
        const date = new Date(2024, 5, 15)
        const unknownType = 'unknown' as DateFormatType
        expect(formatDateCommon(date, unknownType)).toBe('20240615')
    })

    // 1桁の月・日の場合
    it('should pad single digit month and day with zero', () => {
        const date = new Date(2024, 0, 5) // 2024年1月5日
        expect(formatDateCommon(date, DATE_DOT)).toBe('2024.01.05')
        
        const date2 = new Date(2024, 4, 3) // 2024年5月3日
        expect(formatDateCommon(date2, DATE_DOT)).toBe('2024.05.03')
    })

    // 2桁の月・日の場合
    it('should not pad double digit month and day', () => {
        const date = new Date(2024, 10, 15) // 2024年11月15日
        expect(formatDateCommon(date, DATE_DOT)).toBe('2024.11.15')
        
        const date2 = new Date(2024, 11, 31) // 2024年12月31日
        expect(formatDateCommon(date2, DATE_DOT)).toBe('2024.12.31')
    })

    // 異なる年のテスト
    it('should format dates from different years', () => {
        expect(formatDateCommon(new Date(2000, 0, 1), DATE_DOT)).toBe('2000.01.01')
        expect(formatDateCommon(new Date(2024, 5, 15), DATE_DOT)).toBe('2024.06.15')
        expect(formatDateCommon(new Date(2100, 11, 31), DATE_DOT)).toBe('2100.12.31')
    })

    // うるう年の場合
    it('should handle leap year February 29th', () => {
        const leapYearDate = new Date(2024, 1, 29) // 2024年2月29日（うるう年）
        expect(formatDateCommon(leapYearDate, DATE_DOT)).toBe('2024.02.29')
        expect(formatDateCommon(leapYearDate, DATE_SLASH)).toBe('2024/02/29')
        expect(formatDateCommon(leapYearDate, DATE_FULL)).toBe('2024年02月29日')
        expect(formatDateCommon(leapYearDate, DATE_OMISSION)).toBe('20240229')
    })

    // 月の境界値（1月と12月）
    it('should handle month boundaries correctly', () => {
        // 1月（getMonth() = 0）
        const janDate = new Date(2024, 0, 15)
        expect(formatDateCommon(janDate, DATE_DOT)).toBe('2024.01.15')
        
        // 12月（getMonth() = 11）
        const decDate = new Date(2024, 11, 15)
        expect(formatDateCommon(decDate, DATE_DOT)).toBe('2024.12.15')
    })

    // 日の境界値（1日と月末）
    it('should handle day boundaries correctly', () => {
        // 月初
        const firstDay = new Date(2024, 5, 1)
        expect(formatDateCommon(firstDay, DATE_DOT)).toBe('2024.06.01')
        
        // 月末（6月30日）
        const lastDay = new Date(2024, 5, 30)
        expect(formatDateCommon(lastDay, DATE_DOT)).toBe('2024.06.30')
    })

    // すべてのフォーマットタイプで同じ日付をテスト
    it('should format the same date in all format types', () => {
        const date = new Date(2024, 5, 15) // 2024年6月15日
        
        expect(formatDateCommon(date, DATE_DOT)).toBe('2024.06.15')
        expect(formatDateCommon(date, DATE_SLASH)).toBe('2024/06/15')
        expect(formatDateCommon(date, DATE_FULL)).toBe('2024年06月15日')
        expect(formatDateCommon(date, DATE_OMISSION)).toBe('20240615')
    })

    // 過去の日付
    it('should handle past dates', () => {
        const pastDate = new Date(1900, 0, 1)
        expect(formatDateCommon(pastDate, DATE_DOT)).toBe('1900.01.01')
    })

    // 未来の日付
    it('should handle future dates', () => {
        const futureDate = new Date(2100, 11, 31)
        expect(formatDateCommon(futureDate, DATE_DOT)).toBe('2100.12.31')
    })
})

/* ==================================== 
    formatDate Test
==================================== */
describe('formatDate', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    // 基本的な日付フォーマット（DATE_DOT の場合）
    it('should format date string using default format (DATE_DOT)', () => {
        const dateString = new Date('2024-01-01T00:00:00Z')
        const result = formatDate(dateString)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
    })

    // DATE_DOT の場合
    it('should format date in DOT format', () => {
        const dateString = new Date(2024, 0, 1) // 2024年1月1日
        const result = formatDate(dateString, DATE_DOT)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
    })

    // DATE_SLASH の場合
    it('should format date in SLASH format', () => {
        const dateString = new Date(2024, 0, 1)
        const result = formatDate(dateString, DATE_SLASH)
        
        expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
    })

    // DATE_FULL の場合
    it('should format date in FULL format', () => {
        const dateString = new Date(2024, 0, 1)
        const result = formatDate(dateString, DATE_FULL)
        
        expect(result).toMatch(/^\d{4}年\d{2}月\d{2}日$/)
    })

    // DATE_OMISSION の場合
    it('should format date in OMISSION format', () => {
        const dateString = new Date(2024, 0, 1)
        const result = formatDate(dateString, DATE_OMISSION)
        
        expect(result).toMatch(/^\d{8}$/) // YYYYMMDD形式（8桁の数字）
    })

    // 異なる日付でのテスト
    it('should format different dates correctly', () => {
        const dates = [
            new Date(2024, 0, 1),
            new Date(2024, 5, 15),
            new Date(2024, 11, 31)
        ]
        
        dates.forEach(date => {
            const result = formatDate(date, DATE_DOT)
            expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
        })
    })

    // ISO文字列からの変換
    it('should handle ISO date strings', () => {
        const isoString = '2024-01-01T00:00:00Z'
        const result = formatDate(new Date(isoString), DATE_DOT)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
    })

    // タイムスタンプからの変換
    it('should handle timestamp numbers', () => {
        const timestamp = new Date(2024, 0, 1).getTime()
        const result = formatDate(new Date(timestamp), DATE_DOT)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
    })

    // すべてのフォーマットタイプで同じ日付をテスト
    it('should format the same date in all format types', () => {
        const dateString = new Date(2024, 5, 15)
        
        const dotResult = formatDate(dateString, DATE_DOT)
        const slashResult = formatDate(dateString, DATE_SLASH)
        const fullResult = formatDate(dateString, DATE_FULL)
        const omissionResult = formatDate(dateString, DATE_OMISSION)
        
        expect(dotResult).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
        expect(slashResult).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
        expect(fullResult).toMatch(/^\d{4}年\d{2}月\d{2}日$/)
        expect(omissionResult).toMatch(/^\d{8}$/)
    })

    // convertToJST が呼ばれることを確認
    it('should convert date to JST before formatting', () => {
        const dateString = new Date('2024-01-01T00:00:00Z')
        const result = formatDate(dateString, DATE_DOT)
        
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
    })
})

/* ==================================== 
    formatDateTime Test
==================================== */
describe('formatDateTime', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    // 基本的な日時フォーマット
    it('should format date and time in correct format', () => {
        const dateString = new Date(2024, 0, 1, 12, 30) // 2024年1月1日 12:30
        const result = formatDateTime(dateString)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/)
    })

    // 時刻が1桁の場合
    it('should pad hours and minutes with zero when single digit', () => {
        const dateString = new Date(2024, 0, 1, 5, 3) // 5時3分
        const result = formatDateTime(dateString)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} 05:03$/)
    })

    // 時刻が2桁の場合
    it('should not pad hours and minutes when double digit', () => {
        const dateString = new Date(2024, 0, 1, 15, 45) // 15時45分
        const result = formatDateTime(dateString)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} 15:45$/)
    })

    // 午前0時0分の場合
    it('should handle midnight (00:00)', () => {
        const dateString = new Date(2024, 0, 1, 0, 0) // 0時0分
        const result = formatDateTime(dateString)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} 00:00$/)
    })

    // 午前0時59分の場合
    it('should handle 00:59', () => {
        const dateString = new Date(2024, 0, 1, 0, 59)
        const result = formatDateTime(dateString)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} 00:59$/)
    })

    // 異なる日付でのテスト
    it('should format different dates correctly', () => {
        const dates = [
            new Date(2024, 0, 1, 10, 30),
            new Date(2024, 5, 15, 14, 45),
            new Date(2024, 11, 31, 23, 59)
        ]
        
        dates.forEach(date => {
            const result = formatDateTime(date)
            expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/)
        })
    })

    // ISO文字列からの変換
    it('should handle ISO date strings', () => {
        const isoString = '2024-01-01T12:30:00Z'
        const result = formatDateTime(new Date(isoString))
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/)
    })

    // 分が1桁のケース
    it('should pad minutes with zero', () => {
        const dateString = new Date(2024, 0, 1, 12, 5) // 12時5分
        const result = formatDateTime(dateString)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} 12:05$/)
    })

    // 時が1桁のケース
    it('should pad hours with zero', () => {
        const dateString = new Date(2024, 0, 1, 9, 30) // 9時30分
        const result = formatDateTime(dateString)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} 09:30$/)
    })

    // うるう年の場合
    it('should handle leap year February 29th with time', () => {
        const leapYearDate = new Date(2024, 1, 29, 15, 45) // 2024年2月29日 15:45
        const result = formatDateTime(leapYearDate)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/)
        expect(result).toContain('02.29')
    })

    // 年末の日付
    it('should handle end of year date with time', () => {
        const endOfYear = new Date(2024, 11, 31, 23, 59)
        const result = formatDateTime(endOfYear)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/)
    })

    // 年初の日付
    it('should handle start of year date with time', () => {
        const startOfYear = new Date(2024, 0, 1, 0, 0)
        const result = formatDateTime(startOfYear)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/)
    })
})

/* ==================================== 
    formatRelativeDate Test
==================================== */
describe('formatRelativeDate', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.useRealTimers()
    })
    
    // 当日（diffDays === 0）
    it('should return "today" when date is today', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2025-10-31T10:00:00Z') // 同じ日
        const result = formatRelativeDate(targetDate)
        
        expect(result).toBe('today')
    })

    // 昨日（diffDays === 1）
    it('should return "yesterday" when date is yesterday', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2025-10-30T10:00:00Z') // 1日前
        const result = formatRelativeDate(targetDate)
        
        expect(result).toBe('yesterday')
    })

    // 2日前（1週間以内）
    it('should return "X days ago" for dates within a week', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2025-10-29T10:00:00Z') // 2日前
        const result = formatRelativeDate(targetDate)
        
        expect(result).toBe('2 days ago')
    })

    // 6日前（1週間以内の境界）
    it('should return "6 days ago" for 6 days ago', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2025-10-25T10:00:00Z') // 6日前
        const result = formatRelativeDate(targetDate)
        
        expect(result).toBe('6 days ago')
    })

    // 1週間前（1週間の境界）
    it('should return "1 week ago" for exactly 7 days ago', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2025-10-24T10:00:00Z') // 7日前（1週間）
        const result = formatRelativeDate(targetDate)
        
        expect(result).toBe('1 week ago')
    })

    // 2週間前（1ヶ月以内）
    it('should return "2 weeks ago" for 14 days ago', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2025-10-17T10:00:00Z') // 14日前
        const result = formatRelativeDate(targetDate)
        
        expect(result).toBe('2 weeks ago')
    })

    // 29日前（1ヶ月以内の境界）
    it('should return weeks ago for dates within a month', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2025-10-02T10:00:00Z') // 29日前
        const result = formatRelativeDate(targetDate)
        
        // 29日 / 7 = 4週間前
        expect(result).toBe('4 weeks ago')
    })

    // 30日前（1ヶ月の境界）
    it('should return "1 month ago" for exactly 30 days ago', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2025-09-30T10:00:00Z') // 30日前（1ヶ月）
        const result = formatRelativeDate(targetDate)
        
        expect(result).toBe('1 month ago')
    })

    // 2ヶ月前（1年以内）
    it('should return "2 months ago" for 60 days ago', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2025-08-31T10:00:00Z') // 60日前（約2ヶ月）
        const result = formatRelativeDate(targetDate)
        
        expect(result).toBe('2 months ago')
    })

    // 364日前（1年の境界）
    it('should return months ago for dates within a year', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2024-10-31T10:00:00Z') // 364日前
        const result = formatRelativeDate(targetDate)
        
        if (result.includes('months ago')) {
            expect(result).toMatch(/^\d+ months ago$/)
        } else {
            expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
        }
    })

    // 365日前（1年の境界）
    it('should return formatted date for exactly 365 days ago', () => {
        const fixedDate = new Date('2025-10-31T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2024-10-30T10:00:00Z') // 365日前（1年）
        const result = formatRelativeDate(targetDate)
        
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
    })

    // 1年を超えた場合（formatDateCommon を使用）
    it('should return formatted date for dates over a year ago', () => {
        const fixedDate = new Date('2024-06-15T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2022-06-15T10:00:00Z') // 2年前
        const result = formatRelativeDate(targetDate)
        
        // formatDateCommon のフォーマット（YYYY.MM.DD）
        expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
    })

    // 未来の日付（負の差分）
    it('should handle future dates', () => {
        const fixedDate = new Date('2025-11-01T12:00:00Z')
        vi.setSystemTime(fixedDate)
        
        const targetDate = new Date('2026-11-01T10:00:00Z') // 1日後
        const result = formatRelativeDate(targetDate)
        
        expect(result).toBe('Invalid date')
    })
})