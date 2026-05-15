"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [contact, setContact] = useState<{ address?: string; phone?: string; email?: string; wechat?: string; working_hours?: string } | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ id: number; platform_name: string; url: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", company: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [contactsData, socialData] = await Promise.all([
          fetch("/api/public/contacts").then((r) => r.json()),
          fetch("/api/public/social").then((r) => r.json()),
        ]);
        if (contactsData?.id) setContact(contactsData);
        setSocialLinks(Array.isArray(socialData) ? socialData : []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const iconMap: Record<string, React.ReactNode> = {
    phone: <Phone className="w-5 h-5" />,
    email: <Mail className="w-5 h-5" />,
    address: <MapPin className="w-5 h-5" />,
    hours: <Clock className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">联系我们</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">开启合作之旅</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">期待与您的交流与合作</p>
        </div>
      </section>

      <section className="py-16 md:py-24 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl text-foreground font-light mb-6">联系方式</h2>
              <div className="space-y-4">
                {contact ? (
                  <>
                    {contact.phone && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0"><Phone className="w-5 h-5" /></div>
                        <div><p className="text-xs text-muted-foreground">电话</p><p className="text-sm text-foreground/80">{contact.phone}</p></div>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0"><Mail className="w-5 h-5" /></div>
                        <div><p className="text-xs text-muted-foreground">邮箱</p><p className="text-sm text-foreground/80">{contact.email}</p></div>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0"><MapPin className="w-5 h-5" /></div>
                        <div><p className="text-xs text-muted-foreground">地址</p><p className="text-sm text-foreground/80">{contact.address}</p></div>
                      </div>
                    )}
                    {contact.working_hours && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0"><Clock className="w-5 h-5" /></div>
                        <div><p className="text-xs text-muted-foreground">工作时间</p><p className="text-sm text-foreground/80">{contact.working_hours}</p></div>
                      </div>
                    )}
                    {contact.wechat && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0"><Mail className="w-5 h-5" /></div>
                        <div><p className="text-xs text-muted-foreground">微信</p><p className="text-sm text-foreground/80">{contact.wechat}</p></div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">暂无联系方式</p>
                )}
              </div>

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-serif text-lg text-foreground font-light mb-4">社交媒体</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((s) => (
                      <Link
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all text-xs"
                      >
                        {s.platform_name.slice(0, 2).toUpperCase()}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-2xl text-foreground font-light mb-6">发送消息</h2>
              {submitted ? (
                <div className="bg-primary/5 rounded-2xl p-8 text-center">
                  <Send className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-foreground/80">感谢您的留言！</p>
                  <p className="text-xs text-muted-foreground mt-1">我们会尽快与您联系</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">姓名 *</label>
                      <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">公司</label>
                      <input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">邮箱 *</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">留言 *</label>
                    <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">
                    发送
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}