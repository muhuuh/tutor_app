declare module "html2pdf.js" {
  interface Options {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: object;
    jsPDF?: object;
  }

  interface Html2Pdf {
    from(element: HTMLElement): Html2Pdf;
    set(options: Options): Html2Pdf;
    save(): Promise<void>;
  }

  function html2pdf(): Html2Pdf;
  export default html2pdf;
}
