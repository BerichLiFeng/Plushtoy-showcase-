import type { Metadata } from "next";
import "./globals.css";
import { LangWrapper } from "./lang-wrapper";

export const metadata: Metadata = {
  title: {
    default: "Dream Doll | 高奢梦幻玩偶品牌",
    template: "%s | Dream Doll",
  },
  description:
    "Dream Doll 高奢梦幻玩偶品牌，拥有专业玩偶工厂，承接玩偶加工定制。梦幻芭蕾风、经典毛绒布艺、新生儿玩偶，传递精致梦幻的玩偶理念。",
  keywords: [
    "玩偶工厂", "玩偶加工", "高奢玩偶", "梦幻芭蕾玩偶",
    "毛绒玩具", "新生儿玩偶", "玩偶定制", "Dream Doll",
    "doll factory", "plush toy", "OEM doll",
  ],
  openGraph: {
    title: "Dream Doll | 高奢梦幻玩偶品牌",
    description: "专业玩偶工厂，承接玩偶加工，自有高奢梦幻玩偶品牌。",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <LangWrapper>{children}</LangWrapper>
      </body>
    </html>
  );
}