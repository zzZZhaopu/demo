// vue3-markdown-it 类型声明
declare module 'vue3-markdown-it' {
  import { DefineComponent } from 'vue';
  
  interface MarkdownProps {
    source: string;
    breaks?: boolean;
    linkify?: boolean;
    typographer?: boolean;
    html?: boolean;
  }
  
  const Markdown: DefineComponent<MarkdownProps>;
  export default Markdown;
}
