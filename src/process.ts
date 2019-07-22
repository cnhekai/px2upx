export class CssUpxProcess {

    constructor(private cog: any) { }

    private rePx: RegExp = /([-]?[\d.]+)p(x)?/;

    private rePxAll: RegExp = /([-]?[\d.]+)px/g;

    /**
     * 换px转换成upx
     * 
     * @private
     * @param {string} pxStr 
     */
    private pxToUpx(pxStr: string) {
        const px = parseFloat(pxStr);
        // let upxValue: number | string = +(px * (750 / this.cog.designWidth)).toFixed(this.cog.fixedDigits);
        let upxValue: number | string = px * (this.cog.fitWidth / this.cog.designWidth);
        return { px: pxStr, pxValue: px, upxValue, upx: upxValue + 'upx' };
    }

    /**
     * px转upx
     * 
     * @param {string} text 需要转换文本，例如：10px 12p
     * @return {Object} { px: '10px', pxValue: 10, rem: '1rem', remValue: 1 }
     */
    convert(text: string) {
        let match = text.match(this.rePx);
        if (!match) {
            return null;
        }
        return this.pxToUpx(match[1]);
    }

    /** 批量转换 */
    convertAll(code: string): string {
        if (!code) {
            return code;
        }
        return code.replace(this.rePxAll, (word: string) => {
            const res = this.pxToUpx(word);
            if (res) {
                return res.upx;
            }
            return word;
        });

    }
}
