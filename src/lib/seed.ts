import { seedData } from "./json-db";

/** Call this once at app startup to populate initial data */
export function seedInitialData() {
  seedData("company", [
    { name: "梦幻玩偶工坊", slogan: "让每一只玩偶都成为值得珍藏的艺术品", description: "我们是一家拥有多年经验的高端玩偶制造工厂，专注于为全球品牌提供OEM/ODM玩偶加工服务，同时运营自有高奢玩偶品牌。从梦幻芭蕾风到经典毛绒布艺，再到新生儿玩偶，我们用匠心工艺和极致细节，传递高奢梦幻的玩偶理念。", about_images: [], values: "匠心工艺 · 梦幻设计 · 品质至上", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ]);

  seedData("banners", [
    { title: "高奢玩偶定制专家", subtitle: "从设计到成品，一站式玩偶制造服务", image_key: "", link_url: "", sort_order: 1, is_active: true },
    { title: "自有品牌 · 梦幻芭蕾风", subtitle: "优雅与梦幻的完美融合", image_key: "", link_url: "/products/ballet", sort_order: 2, is_active: true },
  ]);

  seedData("categories", [
    { name: "梦幻芭蕾风", slug: "ballet", description: "优雅灵动的芭蕾主题玩偶系列", image_key: "", sort_order: 1, is_active: true },
    { name: "经典毛绒布艺", slug: "classic", description: "经典传承的毛绒布艺玩偶系列", image_key: "", sort_order: 2, is_active: true },
    { name: "新生儿玩偶", slug: "newborn", description: "专为新生儿打造的柔软安全玩偶系列", image_key: "", sort_order: 3, is_active: true },
  ]);

  seedData("products", [
    { category_id: 1, name: "芭蕾舞裙小熊", description: "精致芭蕾舞裙搭配柔软小熊，梦幻优雅", price: "¥388", image_keys: "", is_active: true, sort_order: 1 },
    { category_id: 1, name: "天鹅湖小兔", description: "经典天鹅湖造型，丝绒质感", price: "¥428", image_keys: "", is_active: true, sort_order: 2 },
    { category_id: 2, name: "经典泰迪熊", description: "高级仿羊绒面料，经典复古造型", price: "¥298", image_keys: "", is_active: true, sort_order: 1 },
    { category_id: 2, name: "法式复古兔", description: "法式浪漫配色，手工刺绣细节", price: "¥358", image_keys: "", is_active: true, sort_order: 2 },
    { category_id: 3, name: "新生儿安抚小熊", description: "超柔短毛绒，安全可啃咬", price: "¥168", image_keys: "", is_active: true, sort_order: 1 },
    { category_id: 3, name: "婴儿梦幻摇铃", description: "内置摇铃，促进听觉发育", price: "¥128", image_keys: "", is_active: true, sort_order: 2 },
  ]);

  seedData("business", [
    { title: "OEM/ODM 加工服务", description: "提供从概念设计、样品开发到批量生产的全流程玩偶加工服务，严格品控，交期保障。", icon: "Factory", image_key: "", sort_order: 1, is_active: true },
    { title: "品牌定制开发", description: "根据品牌定位量身打造专属玩偶系列，从材质选择到工艺细节，全方位定制。", icon: "Wand2", image_key: "", sort_order: 2, is_active: true },
    { title: "礼品渠道供应", description: "为高端酒店、奢侈品品牌、母婴品牌等提供礼品玩偶批量供应服务。", icon: "Gift", image_key: "", sort_order: 3, is_active: true },
  ]);

  seedData("clients", [
    { name: "Luxury Kids Co.", logo_key: "", description: "欧洲高端儿童生活方式品牌", sort_order: 1, is_active: true },
    { name: "Petit Dreams", logo_key: "", description: "法国知名母婴品牌", sort_order: 2, is_active: true },
    { name: "Royal Gift", logo_key: "", description: "中东皇室礼品供应商", sort_order: 3, is_active: true },
  ]);

  seedData("cases", [
    { title: "10000只芭蕾小熊定制", description: "为法国奢侈品牌定制芭蕾主题玩偶，从设计到出货仅用45天，获得客户高度赞誉。", client_name: "Petit Dreams", image_keys: "", is_active: true, sort_order: 1 },
    { title: "中东皇室新生儿礼盒", description: "为中东皇室定制的高端新生儿玩偶礼盒，包含12款不同造型的安抚玩偶。", client_name: "Royal Gift", image_keys: "", is_active: true, sort_order: 2 },
  ]);

  seedData("certifications", [
    { title: "ISO 9001 质量管理体系", description: "国际标准化组织质量管理体系认证", image_key: "", is_active: true, sort_order: 1 },
    { title: "EN71 欧洲玩具安全标准", description: "符合欧盟玩具安全指令要求", image_key: "", is_active: true, sort_order: 2 },
    { title: "ASTM F963 美国玩具安全标准", description: "通过美国玩具安全标准检测", image_key: "", is_active: true, sort_order: 3 },
  ]);

  seedData("exhibitions", [
    { title: "2024 上海国际玩具展", description: "展示最新芭蕾风系列产品", image_key: "", date: "2024-10", is_active: true, sort_order: 1 },
    { title: "2024 法兰克福礼品展", description: "欧洲市场拓展与品牌展示", image_key: "", date: "2024-08", is_active: true, sort_order: 2 },
  ]);

  seedData("contacts", [
    { phone: "+86 400-888-9999", email: "hello@dollstudio.com", address: "中国广东省广州市番禺区梦幻工业园8号", wechat: "DreamDoll_Official", working_hours: "周一至周五 9:00-18:00", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ]);

  seedData("social_links", [
    { platform_name: "Instagram", url: "https://instagram.com", icon: "instagram", sort_order: 1 },
    { platform_name: "Pinterest", url: "https://pinterest.com", icon: "pinterest", sort_order: 2 },
    { platform_name: "Website", url: "https://example.com", icon: "globe", sort_order: 3 },
  ]);
}
